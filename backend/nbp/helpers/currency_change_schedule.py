import math

def schedule_currency_pairs(data_array_C1, data_array_C2, time):
    data_array_divided = []
    results = []
    
    if len(data_array_C1) == len(data_array_C2):
        for i in range(len(data_array_C1)):
            if data_array_C1[i] == 0 or data_array_C2[i] == 0:
                return None
            data_array_divided.append(round(data_array_C1[i] / data_array_C2[i], 6))
    
    for i in range(1, len(data_array_divided)):
        currency_change = (data_array_divided[i-1] - data_array_divided[i])/data_array_divided[i]
        if currency_change is not None:
            results.append(currency_change)
            
    max_val = max(results)
    min_val = min(results)

    number_of_bars = round(math.sqrt(len(results)))

    bar_length = (max_val - min_val)/number_of_bars
    size_range = []
    percent_value = []


    for i in range(number_of_bars):
        if i == 0:
            size_range.append({'first': min_val, 'second': min_val + bar_length})
        else:
            size_range.append({'first': size_range[i-1]['second'], 'second': size_range[i-1]['second'] + bar_length})
        percent_value.append(0) 

    for result in results:
        for i, range_value in enumerate(size_range):
            if result >= range_value['first'] and result <= range_value['second']:
                percent_value[i] += 1


    sum_val = sum(percent_value)
    chart_data = []
    for i, value in enumerate(percent_value):
        chart_data.append({
            'time' : time,
            'scope' : f'"{round(size_range[i]["first"],6)}", "{round(size_range[i]["second"], 6)}"',
            'value' : round((value/sum_val) * 100, 6),
        })     
            
    return chart_data