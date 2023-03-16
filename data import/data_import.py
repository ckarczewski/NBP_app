from datetime import timedelta, date
import psycopg2
import requests
from dotenv import load_dotenv
import os


def data_import():
	tables = ['A', 'B', 'C']
	data_table = []

	conn = connect_to_db()
	for table_type in tables:
		url_date_start = date(2023, 1, 6)
		url_date_end = url_date_start + timedelta(days=93)
		while True:
			if url_date_end > date.today():
				url_date_end = date.today()
			if url_date_start == date.today() or url_date_start > date.today():
				break
			resp = get_data(table_type, url_date_start, url_date_end)
			for x in resp:
				data_table.append(x)
			if table_type == 'C':
				insert_table = create_inserts_c(data_table, table_type)
			else:
				insert_table = create_inserts(data_table, table_type)
			execute_inserts(conn, insert_table)
			data_table.clear()
			url_date_start = url_date_end + timedelta(days=1)
			url_date_end = url_date_start + timedelta(days=93)

	conn.close()


def create_url(url_type, url_date_start, url_date_end):
	url_table_a = 'http://api.nbp.pl/api/exchangerates/tables/A/'
	url_table_b = 'http://api.nbp.pl/api/exchangerates/tables/B/'
	url_table_c = 'http://api.nbp.pl/api/exchangerates/tables/C/'

	if url_type == 'A':
		return url_table_a + str(url_date_start) + '/' + str(url_date_end)
	if url_type == 'B':
		return url_table_b + str(url_date_start) + '/' + str(url_date_end)
	if url_type == 'C':
		return url_table_c + str(url_date_start) + '/' + str(url_date_end)


def create_inserts(data_table, table_type):
	insert_start = "INSERT INTO tabela_" + table_type.lower() + " VALUES(default,'"
	insert_table = []
	tmp = []
	for line in data_table:
		insert_command = insert_start + line['no'] + "','" + line['effectiveDate'] + "'"
		for rate in line['rates']:
			try:
				insert_command_full = insert_command + ",'" + rate['country'] + "','" + rate['code'] + "'," + str(
					rate['mid']) + ");"
			except KeyError:
				insert_command_full = insert_command + ",'" + rate['code'] + "','" + rate['code'] + "'," + str(
					rate['mid']) + ");"
			tmp.append(insert_command_full)
		insert_table.append(tmp)
		tmp = []
	return insert_table


def create_inserts_c(data_table, table_type):
	insert_start = "INSERT INTO tabela_" + table_type.lower() + " VALUES(default,'"
	insert_table = []
	tmp = []
	for line in data_table:
		insert_command = insert_start + line['no'] + "','" + line['tradingDate'] + "','" + line['effectiveDate'] + "'"
		for rate in line['rates']:
			try:
				insert_command_full = insert_command + ",'" + rate['country'] + "','" + rate['code'] + "'," + str(
					rate['bid']) + "," + str(rate['ask']) + ");"
			except KeyError:
				insert_command_full = insert_command + ",'" + rate['code'] + "','" + rate['code'] + "'," + str(
					rate['bid']) + "," + str(rate['ask']) + ");"
			tmp.append(insert_command_full)
		insert_table.append(tmp)
		tmp = []
	return insert_table


def get_data(url_type, url_date_start, url_date_end):
	return requests.get(create_url(url_type, url_date_start, url_date_end)).json()


def connect_to_db():
	load_dotenv('.env')
	return psycopg2.connect(
		host=os.environ.get('DATABASE_HOST'),
		dbname=os.environ.get('DATABASE_NAME'),
		user=os.environ.get('DATABASE_USERNAME'),
		password=os.environ.get('DATABASE_PASSWORD'))


def execute_inserts(conn, insert_table):
	cur = conn.cursor()
	for inserts in insert_table:
		for insert in inserts:
			cur.execute(insert)
		conn.commit()
	cur.close()


if __name__ == '__main__':
	data_import()
