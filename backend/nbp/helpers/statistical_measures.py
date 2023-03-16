import math

def median(numbers_array):
    currency_prices = sorted(numbers_array)
    index = len(currency_prices) // 2
    if len(currency_prices) == 0:
        return None
    elif len(currency_prices) % 2 != 0:
        return currency_prices[index]
    else:
        return round((currency_prices[index - 1] + currency_prices[index]) / 2, 5)
    
def dominant(numbers_array):
    counts = {}
    max_value = 0
    dominants = []
    if len(numbers_array) == 0:
        return None
    for number in numbers_array:
        if number not in counts:
            counts[number] = 1
        else:
            counts[number] = counts[number] + 1
    for number in counts:
        if counts[number] > max_value:
            max_value = counts[number]
    for number in counts:
        if counts[number] == max_value:
            dominants.append(number)
    return dominants

def standard_deviation(numbers_array):
    if len(numbers_array) == 0:
        return None
    mean = sum(numbers_array) / len(numbers_array)
    dominator = list(map(lambda x: pow(x-mean,2), numbers_array))
    variation = sum(dominator) / len(dominator)

        
    return round(math.sqrt(variation), 3)

def coefficient_of_variation(numbers_array):
    if len(numbers_array) == 0:
        return None

    mean = sum(numbers_array) / len(numbers_array)

    deviation = standard_deviation(numbers_array)

    if mean == 0:
        return None
    if deviation == 0:
        return None
    return round((deviation/mean)*100, 2)




    