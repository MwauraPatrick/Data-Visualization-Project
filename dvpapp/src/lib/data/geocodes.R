
# Load the ggmap package
library(ggmap)

# Set your Google Maps API key
register_google(key = "h_q32mpsm85kE")

# Load the data
customers <- read.csv("Customers.csv")

# Geocode the addresses
geocodes <- lapply(1:nrow(customers), function(i) {
  result <- try(geocode(paste(customers$CustomerCity[i], customers$CustomerCountry[i], sep = ", ")), silent = TRUE)
  if (inherits(result, "try-error")) {
    return(data.frame(lat = NA, lon = NA))
  } else {
    return(result)
  }
})

# Combine the geocodes with the original data
geocoded_customers <- cbind(customers, do.call(rbind, geocodes))

# Save the geocoded data to a new CSV file
write.csv(geocoded_customers, "geocoded_customers.csv", row.names = FALSE)
