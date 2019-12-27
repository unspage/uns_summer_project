from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import sys
info = {}
choice1 = sys.argv[1]
choice2 = sys.argv[2]
chrome_options = webdriver.ChromeOptions()
prefs = {'profile.managed_default_content_settings.images': 2}
chrome_options.add_experimental_option('prefs', prefs)
path="C:\\Users\\uns\\Downloads\\chromedriver"
driver = webdriver.Chrome(path)

driver.get('http://www.megabox.co.kr/?menuId=timetable-cinema')

v1 = driver.find_element_by_id('container').find_element_by_link_text('경기')
v1.click()

v2 = driver.find_element_by_id('region_30').find_element_by_link_text(choice1)
v2.click()

time = []
seat = []
movie = [x for x in driver.find_elements_by_xpath("//*[@title]")]
for m in movie:
    if choice2 in m.get_attribute("title"):
        div = m.find_element_by_xpath('..')
        time.append(div.find_element_by_css_selector("p span.time").text)
        seat.append(div.find_element_by_css_selector("p span.seat").text)

info['time'] = time
info['seat'] = seat
info = json.dumps(info,separators=(',',':'))
driver.quit()

print(info)