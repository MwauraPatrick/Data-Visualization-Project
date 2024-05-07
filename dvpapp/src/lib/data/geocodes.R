
# Load the ggmap package
library(ggmap)

# Set your Google Maps API key
register_google(key = "AIzaSyCeNK1xwxd3L739ccim-uh_q32mpsm85kE")

# Load the data
Plants <- read.csv("Plants.csv")

# Geocode the addresses
geocodes <- lapply(1:nrow(Plants), function(i) {
  result <- try(geocode(paste(Plants$PlantCity[i], sep = ", ")), silent = TRUE)
  if (inherits(result, "try-error")) {
    return(data.frame(lat = NA, lon = NA))
  } else {
    return(result)
  }
})

# Combine the geocodes with the original data
geocoded_plants <- cbind(Plants, do.call(rbind, geocodes))

# Save the geocoded data to a new CSV file
write.csv(geocoded_plants, "geocoded_plants.csv", row.names = FALSE)
