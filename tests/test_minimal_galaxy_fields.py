import unittest

from scripts import build_galaxy_database


class MinimalGalaxyFieldsTests(unittest.TestCase):
    def test_minimal_record_keeps_only_required_fields(self):
        entry = {
            'id': 'test-1',
            'name': 'A dusty interacting spiral galaxy with an elliptical companion',
            'summary': 'This galaxy is elliptical and interacting while also showing spiral structure.',
            'fullSummary': 'Long narrative text ...',
            'sourceUrl': 'https://example.com/galaxy',
            'imageUrl': 'https://example.com/image.jpg',
            'ageGyr': 9.5,
            'redshift': 0.2,
        }

        result = build_galaxy_database.build_minimal_record(entry)

        self.assertEqual(
            set(result.keys()),
            {'id', 'name', 'ageGyr', 'isElliptical', 'isSpiral', 'isInteracting'},
        )
        self.assertTrue(result['isSpiral'])
        self.assertTrue(result['isElliptical'])
        self.assertTrue(result['isInteracting'])
        self.assertAlmostEqual(result['ageGyr'], 9.5)


if __name__ == '__main__':
    unittest.main()
