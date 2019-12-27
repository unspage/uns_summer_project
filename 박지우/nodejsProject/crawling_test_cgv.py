from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import sys
info = {}
choice1 = "CGV"+sys.argv[1]
choice2 = sys.argv[2]
chrome_options = webdriver.ChromeOptions()
prefs = {'profile.managed_default_content_settings.images': 2}
chrome_options.add_experimental_option('prefs', prefs)
path="C:\\Users\\uns\\Downloads\\chromedriver"
driver = webdriver.Chrome(path)

driver.get('http://www.cgv.co.kr/theaters/')

v1 = driver.find_element_by_id('contents').find_element_by_link_text('경기')
v1.click()

WebDriverWait(driver,10).until(
            EC.visibility_of_all_elements_located((
                By.CSS_SELECTOR,"#contents div.sect-common div div.sect-city ul li.on div ul"))
            )

btn = driver.find_element_by_id('contents').find_element_by_link_text(choice1)
btn.click()
driver.window_handles
driver.switch_to.frame("ifrm_movie_time_table")
WebDriverWait(driver,15).until(
            EC.visibility_of_all_elements_located((
                By.CSS_SELECTOR,"body div div.sect-showtimes ul li"))
            )

ul = driver.find_element_by_css_selector("body div div.sect-showtimes ul").find_element_by_link_text(choice2)
v2 = [x.text for y in ul.find_element_by_xpath('..').find_element_by_xpath('..').find_elements_by_css_selector("div.type-hall") for x in y.find_element_by_css_selector("div.info-timetable ul").find_elements_by_tag_name('a')]
info['time'] = []
info['seat'] = []
for i in v2:
    a = i.split('\n')[1]
    if (a != "마감"):
        info['time'].append(i.split('\n')[0])
        info['seat'].append(a[:-1])

info = json.dumps(info,separators=(',',':'))

driver.quit()    

print(info)

