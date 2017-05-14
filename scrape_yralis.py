import requests
import bs4
import csv

data = []
output_str =""
start_url = 'http://www.yralis.org/base-ratings'

try:
	domain=start_url[0:(start_url[9:].index('/')+9)]
except ValueError:
	domain = start_url

def scrape(url):
	global output_str
	global data
	print("Scraping: ",url)
	r = requests.get(url)
	soup = bs4.BeautifulSoup(r.text, 'html.parser')

	item = soup.select('tbody')

	for row in soup.select('tbody tr'):
		phrf = row.select('td.views-field-field-rate-spin-base-wl-value')
		boat = row.select('td.views-field-title-1 a')
		loa = row.select('td.views-field-field-meas-loa-value')
		displacement = row.select('td.views-field-field-meas-displ-value')

		output_str = output_str + "{}: {}\n".format(boat[0].text, phrf[0].text.strip())
		# data[boat[0].text] = phrf[0].text.strip()
		data.append({
			'boat': boat[0].text,
			'phrf': phrf[0].text.strip(),
			'loa': loa[0].text.strip(),
			'displacement': displacement[0].text.strip()
			})

	pager = soup.select('li.pager-next a')

	try:
		pager[0]['href']
		next_url = "{}{}".format(domain,pager[0]['href'])
		scrape(next_url)
	except IndexError:
		return None

	return next_url

print(scrape(start_url))	
print(output_str)
print(data)

file_name = 'yralis.csv'
with open(file_name, 'w') as csvfile:
	data_writer = csv.writer(csvfile, delimiter=",")
	data_writer.writerow(['boat','phrf','loa', 'displacement'])
	# for k in data.keys():
	# 	data_writer.writerow([k, data[k]])
	for i in data:
		if float(i['loa']) != 0.0:
			data_writer.writerow([i['boat'], i['phrf'], i['loa'], i['displacement']])
	csvfile.close()