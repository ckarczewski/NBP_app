import os
from datetime import date

from dotenv import load_dotenv
from psycopg2 import errors
import psycopg2
import requests


def update_db():
	tables = ['A', 'B', 'C']
	latest_table_dates = {
		'A': '',
		'B': '',
		'C': ''
	}
	conn = connect_to_db()
	for table_type in tables:
		latest_table_dates[table_type] = (check_db_data(conn, table_type))
	for table_type in tables:
		update_table(table_type, latest_table_dates[table_type], conn)


def update_table(table_type, latest_table_date, conn):
	url_date_end = date.today()
	url_date_start = latest_table_date
	data_table = []

	resp = get_data(table_type, url_date_start, url_date_end)
	for x in resp:
		data_table.append(x)
	if table_type == "C":
		inserts = create_inserts_c(data_table, table_type)
	else:
		inserts = create_inserts(data_table, table_type)
	execute_inserts(conn, inserts)


def get_data(url_type, url_date_start, url_date_end):
	url = create_url(url_type, url_date_start, url_date_end)
	resp = requests.get(url)
	return resp.json()


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
			try:
				cur.execute(insert)
			except psycopg2.errors.UniqueViolation:
				continue
		conn.commit()
	cur.close()


def check_db_data(conn, table_type):
	query = 'SELECT MAX("Effective Date") FROM tabela_' + table_type.lower() + ';'
	conn.autocommit = True
	cur = conn.cursor()
	cur.execute(query)
	result = cur.fetchone()
	cur.close()
	return result[0]


def create_url(url_type, url_date_start, url_date_end):
	url_table_a = 'http://api.nbp.pl/api/exchangerates/tables/A/'
	url_table_b = 'http://api.nbp.pl/api/exchangerates/tables/B/'
	url_table_c = 'http://api.nbp.pl/api/exchangerates/tables/C/'
	url_dates = str(url_date_start) + '/' + str(url_date_end)

	if url_date_start == url_date_end:
		url_dates = str(url_date_end)
	if url_date_start > url_date_end:
		url_dates = str(url_date_end)

	if url_type == 'A':
		return url_table_a + url_dates
	if url_type == 'B':
		return url_table_b + url_dates
	if url_type == 'C':
		return url_table_c + url_dates


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


if __name__ == "__main__":
	update_db()
