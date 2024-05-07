install.packages("ggmap")
library(ggmap)


# Load the data
customers <- read.csv("Customers.csv")

# Geocode the addresses
geocodes <- geocode(paste(customers$City, customers$Country, sep = ", "))

# Combine the geocodes with the original data
geocoded_customers <- cbind(customers, geocodes)

# Save the geocoded data to a new CSV file
write.csv(geocoded_customers, "geocoded_customers.csv", row.names = FALSE)
