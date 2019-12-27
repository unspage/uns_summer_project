from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import sys

info = {}
choice1 = sys.argv[3]
choice2 = sys.argv[1]
path="C:\\Users\\uns\\Downloads\\chromedriver"
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('headless')
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('lang=ko_KR')


driver = webdriver.Chrome(path, chrome_options=chrome_options)
driver.get('http://www.megabox.co.kr/?menuId=timetable-cinema')

seoul = driver.find_element_by_css_selector("#container div.section.no1 div.theater_lst div ul li:nth-child(2) a")
WebDriverWait(driver,10).until(
            EC.element_to_be_clickable((
                By.CSS_SELECTOR,"#container div.section.no1 div.theater_lst div ul li:nth-child(2) a"))
            
            )

seoul.click()

WebDriverWait(driver,10).until(
            EC.visibility_of_all_elements_located((
                By.CSS_SELECTOR,"#region_10"))
            )
ul = driver.find_element_by_id("region_10")
aa =ul.find_element_by_link_text(choice1)
aa.click()

movie = [x for x in driver.find_elements_by_xpath("//*[@title]")]
time = []
seat = []

for m in movie:
    if choice2 in m.get_attribute("title"):
        div = m.find_element_by_xpath('..')
        time.append(div.find_element_by_css_selector("p span.time").text)
        seat.append(div.find_element_by_css_selector("p span.seat").text)
        
info["time"] = time
info["seat"] = seat
info = json.dumps(info, separators=(',',':'))
driver.quit()
print(info)