# Data-Visualization-Project
Group Assignment

Please see the group report here: https://docs.google.com/document/d/1ERKE3EloMDyXOAAYrLuF_0XaoCiNZfEHjb1CSfOwh-s/edit

PART 1 Metadata
Version: Design (25/3/2024)
Students: student 1 : Sariga Kakkamani 2364698 Hasselt University
student 2 : Simon Bayou Bizuneh 2364704 Hasselt University
student 3 : Waweru Mwaura 2364796 Hasselt University
Group number: group_35
Dataset: Suncharge

PART 2 Project description
Project: Suncharge Supply Chain Monitoring System
The Supply Chain Monitoring System project focuses on optimising the supply chain for Suncharge, a company that produces batteries for car and home electrical needs. By leveraging collected data, we aim to monitor the supply chain and gain insights for developing effective strategies for enhancing efficiency.
Key Features:
Vendor Information: The data includes details about both external and internal vendors. Understanding vendor performance, reliability, and lead times is crucial for supply chain optimization.
Production Plant Activities: Insights into production processes, capacity utilisation, and bottlenecks are essential. We’ll analyse production efficiency, quality control, and resource allocation.
Distribution Data: Tracking distribution channels, transportation modes, and delivery times helps identify areas for improvement. Efficient logistics play a vital role in supply chain optimization.
Customer Data: Understanding customer demand patterns, preferences, and feedback informs inventory management and production planning.
Guiding Questions:
By addressing these questions, we aim to enhance Suncharge’s supply chain efficiency and overall performance.
How can we increase efficiency? We’ll explore bottlenecks, delays, and inefficiencies at each stage of the supply chain. Are there production bottlenecks? Can we optimise transportation routes?
How do we make insights detectable through a dashboard? Creating a user-friendly dashboard with real-time data visualisation is crucial. What metrics should be displayed? How can we ensure actionable insights?
How can this information drive decision-making? We’ll assess how supply chain insights impact strategic decisions. Can we reduce lead times? Should we adjust production schedules based on demand fluctuations?









PART 3. Visual design

The process of reaching the final design involved several steps. Initially, we gained an understanding of the system requirements, which were discussed in our first meeting. For the second meeting, we agreed to generate our own ideas, resulting in divergent sketches. These sketches were then uploaded to our group Miro interface, where each team member presented their ideas to the group. We subsequently discussed the sketches, ensuring they addressed the guiding questions and provided clarity to end users. This process led to the creation of the emergent part. In the convergent part, we selected only those sketches that offered quick insight and allowed users to customise the dashboard layout to suit their needs.

Divergent Sketches



Convergent Sketches








Emergent Sketch
  Please see appendix A

If I had an experienced programmer at my disposal, I would prioritise implementing the following reworked sketches to enhance the exploration of the general questions raised:
Interactive Map with Drill-down Functionality
Visual Encoding: The map would visually represent the locations of vendors, plants, and customer countries, using colour encoding to differentiate between different types of locations and quantities. Clicking on a location would drill down to show detailed information about the quantities at that location.
Interaction: Users could interact with the map by clicking on locations to view detailed information. A date picker would allow selection of specific date ranges for viewing quantities over time.
Benefits: This design would help explore the distribution of quantities across locations, track variations over time, and identify patterns of overstocking or understocking. It would provide a spatial understanding of the supply chain and aid in optimising inventory management.
Time Series Plot with Comparative Analysis
Visual Encoding: The time series plot would display trends in order quantity and purchase quantity over time, segmented by product type and location. Line graphs would show the trends for each quantity and location.
Interaction: Users could interact with the plot by selecting specific locations, products, or date ranges to compare trends. Hovering over data points would display detailed information about quantities at specific points in time.
Benefits: This design would help explore trends in quantities, identify patterns of overstocking or understocking, and compare trends across different locations and products. It would provide a chronological understanding of inventory management dynamics and support decision-making to optimise inventory levels.
Implementing these reworked sketches would provide a comprehensive and interactive visualisation of the supply chain, enabling users to explore and analyse the data more effectively to address the general questions mentioned.
Appendix A

https://docs.google.com/document/d/1ERKE3EloMDyXOAAYrLuF_0XaoCiNZfEHjb1CSfOwh-s/edit

Description 
The graphs we have designed will help us in addressing the questions we have raised. Specifically:
The dashboard will have a title, the logo of the company and a brief introduction about the company. 
The map will visually display the locations of vendors, plants, and customer countries. It will show various quantities such as stock, inventory, units produced, ordered and purchased, and forecasted amounts for all these locations. The map will include a tooltip feature that appears when hovering over or selecting a region, displaying all the quantities associated with that location. This feature is designed to provide a quick overview of the supply chain status and illustrate variations in quantities across different locations.  In addition, the map can include a date picker functionality, allowing users to select a specific date to view the status of quantities for that particular date. This feature enables users to track the progress and variations in quantities over time, providing a more comprehensive understanding of the supply chain dynamics.
The time series plot complements the map by displaying all quantities in a time series format, allowing users to observe trends over time for each quantity and location if necessary, as well as for selected date ranges. Additionally, it provides a detailed analysis of trends in order quantity and purchase quantity over time. While the map offers a spatial view of these quantities across different locations, the time series plot presents a chronological perspective, enabling a deeper understanding of inventory management dynamics. This combined visualisation not only helps in identifying patterns of overstocking or understocking but also improves inventory turnover rates. It empowers users to make informed decisions to optimise the supply chain by addressing any mismatches and improving overall efficiency.
On the left side of the visualisation, there is a doughnut plot representing inventory quantities. This plot compares the quantities of products available on the shelf with those currently in transit. It provides an overview of the total inventory available for sale. Below the doughnut plot, there is a time-cost bar plot that illustrates the relationship between time and cost, displayed in currency. This plot is segmented by production or distribution plants. Its purpose is to highlight areas where cost optimization is not optimal and to suggest improvements to address cost inefficiencies in these plants or distribution centres.
On the right side of the display, there are three sections. The first section features news highlights related to the Suncharge supply chain, providing users with the latest information. This ensures that the system offers the most up-to-date and responsive experience for users.
Below the news highlights is a cost-sales plot, which illustrates the relationship between the cost of the entire supply chain and the sales. This plot allows users to see the ratio of cost to sales, helping them determine if it is favourable for the company. Additionally, there is a planned feature to select a specific plant or country to show which plants or countries incur the most cost.
Further down, there is a plant-customer plot that displays the number of customers for each plant and trends over time. This plot is designed to monitor changes in customer numbers, indicating areas where the company's products may be losing or gaining customers.
The dashboard will be actionable by providing context and recommendations based on the data presented, enabling users to make informed decisions and take appropriate actions to improve supply chain performance and optimization.




