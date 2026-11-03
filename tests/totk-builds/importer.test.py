import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('totk_importer', ROOT / 'scripts/import-totk-builds.py')
importer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(importer)


class CategoriesTest(unittest.TestCase):
    def test_flying_bike_is_not_assumed_to_be_a_land_vehicle(self):
        self.assertEqual(importer.categories('Perfect Hoverbike', ['flying', 'vehicle', 'bike'], 'Hoverbike'), ['flying'])

    def test_hover_ship_is_not_assumed_to_float_on_water(self):
        self.assertEqual(importer.categories('Hover Ship', ['laser', 'combat'], 'Combat vehicle'), ['flying', 'combat'])

    def test_explicit_amphibious_vehicle_keeps_both_capabilities(self):
        self.assertEqual(importer.categories('Amphibious Buggy', ['vehicle'], 'Vehicle'), ['water', 'ground'])

    def test_boat_is_not_a_land_vehicle_just_because_it_has_a_motor(self):
        self.assertEqual(importer.categories('Motor Boat', ['vehicle'], 'Boat'), ['water'])


if __name__ == '__main__':
    unittest.main()
