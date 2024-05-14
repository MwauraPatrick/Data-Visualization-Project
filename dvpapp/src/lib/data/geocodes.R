
# Load the ggmap package
library(ggmap)

# Set your Google Maps API key
register_google(key = "")

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




# Install and load required packages
# install.packages("geojsonio")
library(geojsonio)

# Load country boundaries data
world <- geojson_read("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json", what = "sp")

# Define the countries you're interested in
countries_of_interest <- c(
  "Belgium", "Croatia", "Czech Republic", "Denmark", "Estonia", "Finland", 
  "France", "Germany", "Greece", "Hungary", "Italy", "Latvia", "Lithuania", 
  "Netherlands", "Norway", "Poland", "Portugal", "Slovenia", "Spain", 
  "Sweden", "Switzerland", "United Kingdom"
)

# Filter the world data to include only the countries of interest
selected_countries <- world[world$name %in% countries_of_interest, ]

# Write the filtered data to a GeoJSON file
geojson_write(selected_countries, file = "selected_countries.geojson")

