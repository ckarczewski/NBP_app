from django.test import TestCase
from nbp.helpers.statistical_measures import median, dominant, standard_deviation, coefficient_of_variation
from nbp.helpers.currency_change_schedule import schedule_currency_pairs


# INPUT IS ASSUMED TO BE CORRECT – NO STRINGS AND DIFFERENT TYPES, JUST AN ARRAY OF DECIMAL OR INT NUMBERS 
class CurrencyPairTestCase(TestCase):
    datasets_1 = [
        [0,0,0,0,0],
        [],
        [5.55],
        [5.55, 1.11],
        [181, 187, 196, 196, 198, 203, 207, 211, 215, 123, 199],
        [1.5, 2.5, 3.5, 4.5, 5.5],
        [0, 0, 0]
    ]
    
    datasets_2 = [
        [1,2,3,4,5],
        [],
        [3.55],
        [3.55, 6.11],
        [141, 127, 496, 296, 118, 213, 507, 212, 235, 128, 189],
        [3, 4, 2, 1, 2],
        [0, 0, 0]
    ]
    
    time = 90

    def test_schedule_currency_pairs(self):
        self.assertEquals(schedule_currency_pairs(self.datasets_1[6], self.datasets_2[6], self.time), None)
        self.assertEquals(schedule_currency_pairs(self.datasets_1[3], self.datasets_2[3], self.time), 
                          [{'time': 90, 'scope': '"7.605651", "7.605651"', 'value': 100.0}])
        self.assertEquals(schedule_currency_pairs(self.datasets_1[5], self.datasets_2[5], self.time), 
                          [{'time': 90, 'scope': '"-0.642857", "-0.003247"', 'value': 75.0},
                          {'time': 90, 'scope': '"-0.003247", "0.636364"', 'value': 25.0}])
        self.assertEqual(schedule_currency_pairs(self.datasets_1[4], self.datasets_2[4], self.time),
                         [{'time': 90, 'scope': '"-0.605378", "0.505141"', 'value': 70.0}, 
                         {'time': 90, 'scope': '"0.505141", "1.615661"', 'value': 20.0},
                         {'time': 90, 'scope': '"1.615661", "2.72618"', 'value': 10.0}])


        