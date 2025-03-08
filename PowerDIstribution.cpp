#include <iostream>
#include <fstream>
#include <cmath>
#include <cstdlib>
#include <ctime>

using namespace std;

// Constants
const double SOLAR_PANEL_CAPACITY = 100.0;
const double BATTERY_CAPACITY = 500.0;
const double CHARGE_EFFICIENCY = 0.9;
const double DISCHARGE_EFFICIENCY = 0.95;
const int SIMULATION_HOURS = 24;

// Function to simulate solar power
double solarPowerOutput(int hour)
{
    if (hour >= 6 && hour <= 18)
    {
        return SOLAR_PANEL_CAPACITY * sin((M_PI / 12) * (hour - 6));
    }
    return 0.0;
}

// Function to simulate power consumption
double powerConsumption(int hour)
{
    return rand() % 40 + 30; // Random consumption between 30W-70W
}

int main()
{
    srand(time(0));
    double batteryLevel = BATTERY_CAPACITY / 2;
    ofstream file("power_data.json");

    file << "[\n"; // Start of JSON array

    for (int hour = 0; hour < SIMULATION_HOURS; ++hour)
    {
        double solarPower = solarPowerOutput(hour);
        double consumption = powerConsumption(hour);
        double netPower = solarPower - consumption;

        if (netPower > 0)
        {
            batteryLevel += netPower * CHARGE_EFFICIENCY;
            if (batteryLevel > BATTERY_CAPACITY)
                batteryLevel = BATTERY_CAPACITY;
        }
        else
        {
            batteryLevel -= abs(netPower) / DISCHARGE_EFFICIENCY;
            if (batteryLevel < 0)
                batteryLevel = 0;
        }

        // Write JSON data
        file << "  {\n";
        file << "    \"hour\": " << hour << ",\n";
        file << "    \"solarPower\": " << solarPower << ",\n";
        file << "    \"consumption\": " << consumption << ",\n";
        file << "    \"batteryLevel\": " << batteryLevel << "\n";
        file << "  }";

        // Print simulation status
        cout << hour << "\t" << solarPower << " W\t"
             << consumption << " W\t"
             << batteryLevel << " Wh\t";

        if (batteryLevel == 0) {
            cout << "⚠ CRITICAL: Battery Depleted!\n";
        } else if (batteryLevel < BATTERY_CAPACITY * 0.2) {
            cout << "⚠ Low Power Mode Activated\n";
        } else {
            cout << "✅ Normal Operation\n";
        }
        
        if (hour < SIMULATION_HOURS - 1)
            file << ","; // Add comma for all but last entry
        file << "\n";
    }

    file << "]\n"; // End of JSON array
    file.close();

    cout << "Data saved to power_data.json\n";
    return 0;
}
