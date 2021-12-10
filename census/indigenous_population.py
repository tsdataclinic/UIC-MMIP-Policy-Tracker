import argparse
import pandas as pd

from cenpy import products

_STATE = [("AL","Alabama"),("AK","Alaska"),("AZ","Arizona"),("AR","Arkansas"),("CA", "California"),("CO", "Colorado"),
("CT","Connecticut"),("DC","Washington DC"),("DE","Delaware"),("FL","Florida"),("GA","Georgia"),
("HI","Hawaii"),("ID","Idaho"),("IL","Illinois"),("IN","Indiana"),("IA","Iowa"),("KS","Kansas"),("KY","Kentucky"),
("LA","Louisiana"),("ME","Maine"),("MD","Maryland"),("MA","Massachusetts"),("MI","Michigan"),("MN","Minnesota"),
("MS","Mississippi"),("MO","Missouri"),("MT","Montana"),("NE","Nebraska"),("NV","Nevada"),("NH","New Hampshire"),
("NJ","New Jersey"),("NM","New Mexico"),("NY","New York"),("NC","North Carolina"),("ND","North Dakota"),("OH","Ohio"),
("OK","Oklahoma"),("OR","Oregon"),("PA","Pennsylvania"),("RI","Rhode Island"),("SC","South Carolina"),("SD","South Dakota"),
("TN","Tennessee"),("TX","Texas"),("UT","Utah"),("VT","Vermont"),("VA","Virginia"),("WA","Washington"),("WV","West Virginia"),
("WI","Wisconsin"),("WY","Wyoming")]

_INDIGENOUS_POPULATION_VARIABLE='B02010_001E'
_TOTAL_POPULATION_VARIABLE='B02001_001E'

def main():
    parser = argparse.ArgumentParser("Create indigenous population data")

    parser.add_argument("--year", type=int, default=2019)
    parser.add_argument("--output", type=str, required=True)

    args = parser.parse_args()

    result = None
    year = args.year

    while not result:
        try:
            print(f"Trying to load the data for {year}")
            result = products.ACS(year)
        except:
            print(f"Data for {year} doesn't exist")
        year -= 1

        if year < 2000:
            raise Exception("can't load data")

    dfs = []
    for state_code, state_name in _STATE:
        print(f"loading state {state_name}")
        data, bounds = result.from_state(state_name, level='county', variables=[_INDIGENOUS_POPULATION_VARIABLE, _TOTAL_POPULATION_VARIABLE], return_bounds=True)
        bounds['state_code'] = state_code
        bounds['indigenous_population'] = data[_INDIGENOUS_POPULATION_VARIABLE].sum()
        bounds['indigenous_population_perentage'] = data[_INDIGENOUS_POPULATION_VARIABLE].sum() / data[_TOTAL_POPULATION_VARIABLE].sum()
        dfs.append(bounds)
    gdf = pd.concat(dfs)
    gdf = gdf[['state_code', 'indigenous_population', 'indigenous_population_perentage', 'geometry']]
    gdf = gdf.to_crs('epsg:4326')
    print(gdf.shape)
    gdf.to_file(args.output, driver='GeoJSON')

if __name__ == "__main__":
    main()