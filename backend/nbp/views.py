from django.shortcuts import (HttpResponse)
from django.http import JsonResponse
from nbp.helpers.statistical_measures import median, dominant, standard_deviation, coefficient_of_variation
from nbp.helpers.currency_change_schedule import schedule_currency_pairs
from datetime import datetime, timedelta
from nbp.models import TabelaA, TabelaB, TabelaC

# Create your views here.

def measures(request):

    if request.method == 'GET':
        currency = request.GET.get('currency', '')
        time_intervals = [7, 14, 30, 90, 180, 360]
        results = []
        data_array = []
        # find code in database
        query_A = TabelaA.objects.values_list('mid').filter(code=currency).filter(country=currency)
        query_B = TabelaB.objects.values_list('mid').filter(code=currency).filter(country=currency)
        
        if query_A:
            table = TabelaA
        elif query_B:
            table = TabelaB
            
        #  get the latest date from the database
        date_str = table.objects.all().order_by("-effective_date")[:1]
        first_date = date_str[0].effective_date
        
        for time in time_intervals:
            second_date = (first_date-timedelta(days=time))
            query = table.objects.values_list('mid').filter(code=currency).filter(effective_date__gte = second_date, effective_date__lt = first_date)
            for q in query:
                data_array.append(float(q[0]))
            temp = {
                    'time' : time,
                    'median' : median(data_array),
                    'dominant' : dominant(data_array),
                    'standard_deviation' : standard_deviation(data_array),
                    'coefficient_of_variation' : coefficient_of_variation(data_array),
            }
            results.append(temp)
 
    
    return JsonResponse(results, safe=False)

def currency_list(request):

    results = []
    query_A = TabelaA.objects.values_list('code').distinct()
    query_B = TabelaB.objects.values_list('code').distinct()
    for q in query_A:
        results.append(q)
        
    for q in query_B:
        results.append(q)
    
    results = list(dict.fromkeys(results))
    
    return JsonResponse(results, safe=False)

def session_scheduling(request):
    if request.method == 'GET':
        currency = request.GET.get('currency', '')
        time_intervals = [7, 14, 30, 90, 180, 360]
        results = []
        data_array = []
        
        count_up = 0
        count_down = 0
        count_const = 0
        
        # find code in database
        query_A = TabelaA.objects.values_list('mid').filter(code=currency).filter(country=currency)
        query_B = TabelaB.objects.values_list('mid').filter(code=currency).filter(country=currency)
        
        if query_A:
            table = TabelaA
        elif query_B:
            table = TabelaB
        
        
        date_str = table.objects.all().order_by("-effective_date")[:1]
        first_date = date_str[0].effective_date
        for time in time_intervals:
            second_date = (first_date-timedelta(days=time))
            query = table.objects.values_list('mid').filter(code=currency).filter(effective_date__gte = second_date, effective_date__lt = first_date)
            
            for q in query:
                data_array.append(float(q[0]))
                
            data_array = list(data_array)

            for i in range(1,len(data_array)):
                if data_array[i-1] > data_array[i]:
                    count_up += 1
                elif data_array[i-1] < data_array[i]:
                    count_down += 1
                elif data_array[i-1] == data_array[i]:
                    count_const += 1
            temp = {
                'time' : time,
                'count_up' : count_up,
                'count_down' : count_down,
                'count_const' : count_const,
            }
            count_up = 0
            count_down = 0
            count_const = 0
            
            results.append(temp)

    return JsonResponse(results, safe=False)

def currency_comparison(request):

    if request.method == 'GET':
        currency_one = request.GET.get('currency_one', '')
        currency_two = request.GET.get('currency_two', '')

        currency = [currency_one, currency_two]
        time_intervals = [30, 90]

        data_array_C1 = []
        data_array_C2 = []
        data_array = []
        res = []

        # find code in database
        for i in range(2):
            time = time_intervals[i]
            for i in range(2):
                query_A = TabelaA.objects.values_list('mid').filter(code=currency[i]).filter(country=currency[i])
                query_B = TabelaB.objects.values_list('mid').filter(code=currency[i]).filter(country=currency[i])
                
                if query_A:
                    table = TabelaA
                elif query_B:
                    table = TabelaB
                    
                date_str = table.objects.all().order_by("-effective_date")[:1]
                first_date = date_str[0].effective_date
                second_date = (first_date-timedelta(days=time))
                query = table.objects.values_list('mid').filter(code=currency[i]).filter(effective_date__gte = second_date, effective_date__lt = first_date)
                    
                for q1 in query:
                    data_array.append(float(q1[0]))
                    
                data_array = list(data_array)
                if i == 0:
                    data_array_C1 = data_array.copy()
                    data_array.clear()
                else:
                    data_array_C2 = data_array.copy()

                    data_array.clear()
                    
            if len(data_array_C1) > len(data_array_C2):
                array_len = len(data_array_C2)
                res.append(schedule_currency_pairs(data_array_C1[0:array_len], data_array_C2, time))
            elif len(data_array_C1) < len(data_array_C2):
                array_len = len(data_array_C1)
                res.append(schedule_currency_pairs(data_array_C1, data_array_C2[0:array_len], time))
            else:
                res.append(schedule_currency_pairs(data_array_C1, data_array_C2, time))

        
    return JsonResponse(res, safe=False)
