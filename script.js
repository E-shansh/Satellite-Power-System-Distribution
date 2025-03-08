// script.js

d3.json("power_data.json").then(data => {
    data.forEach(d => {
        d.hour = +d.hour;
        d.solarPower = +d.solarPower;
        d.consumption = +d.consumption;
        d.batteryLevel = +d.batteryLevel;
    });

    const svg = d3.select("svg"),
        width = svg.attr("width"),
        height = svg.attr("height"),
        margin = { top: 20, right: 30, bottom: 40, left: 50 },
        graphWidth = width - margin.left - margin.right,
        graphHeight = height - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain([0, 23]).range([0, graphWidth]);
    const y = d3.scaleLinear().domain([0, 500]).range([graphHeight, 0]);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    g.append("g")
        .attr("transform", `translate(0, ${graphHeight})`)
        .call(d3.axisBottom(x));

    g.append("g").call(d3.axisLeft(y));

    const line = d3.line().x(d => x(d.hour)).y(d => y(d.solarPower));
    const batteryLine = d3.line().x(d => x(d.hour)).y(d => y(d.batteryLevel));
    const consumptionLine = d3.line().x(d => x(d.hour)).y(d => y(d.consumption));

    g.append("path").datum(data).attr("class", "line solar").attr("d", line);
    g.append("path").datum(data).attr("class", "line battery").attr("d", batteryLine);
    g.append("path").datum(data).attr("class", "line consumption").attr("d", consumptionLine);

    // Tooltip
    const tooltip = d3.select(".tooltip");

    g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.hour))
        .attr("cy", d => y(d.solarPower))
        .attr("r", 5)
        .attr("fill", "orange")
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible")
                .text(`Hour: ${d.hour}, Solar: ${d.solarPower}, Battery: ${d.batteryLevel}, Usage: ${d.consumption}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mousemove", (event) => {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));
});
document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("darkModeToggle");
    const toggleIcon = document.getElementById("toggleIcon");

    // Function to check system preference
    function isSystemDarkMode() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    // Apply dark mode based on system settings OR saved user preference
    if (localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && isSystemDarkMode())) {
        document.body.classList.add("dark-mode");
        toggleIcon.textContent = "🌞"; // Show sun icon
    }

    // Add event listener for manual toggle
    toggleButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        toggleIcon.classList.add("rotate");

        if (document.body.classList.contains("dark-mode")) {
            toggleIcon.textContent = "🌞";
            localStorage.setItem("theme", "dark");
        } else {
            toggleIcon.textContent = "🌙";
            localStorage.setItem("theme", "light");
        }

        setTimeout(() => toggleIcon.classList.remove("rotate"), 300);
    });

    // Listen for system theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (e.matches) {
            document.body.classList.add("dark-mode");
            toggleIcon.textContent = "🌞";
        } else {
            document.body.classList.remove("dark-mode");
            toggleIcon.textContent = "🌙";
        }
    });
});
