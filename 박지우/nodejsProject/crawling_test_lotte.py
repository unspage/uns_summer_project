from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import sys
import re
info = {}
choice1 = sys.argv[1]
choice2 = re.sub('[-=+,#/\?:^$.@*\"※~&%ㆍ!』\\‘|\(\)\[\]\<\>`\'…》]', '', sys.argv[2])
choice2 = choice2.split(' ')[0]
chrome_options = webdriver.ChromeOptions()
prefs = {'profile.managed_default_content_settings.images': 2}
chrome_options.add_experimental_option('prefs', prefs)
path="C:\\Users\\uns\\Downloads\\chromedriver"
driver = webdriver.Chrome(path)

driver.get('http://www.lottecinema.co.kr/LCHS/Contents/Cinema/charlotte-special-cinema.aspx?divisionCode=2&screendivcd=300')

v1 = driver.find_element_by_css_selector("#wrap div.header div.gnb").find_element_by_link_text("경기/인천")
v1.click()
WebDriverWait(driver,10).until(
            EC.visibility_of_all_elements_located((
                By.CSS_SELECTOR,"#wrap"))
            )
v2 = v1.find_element_by_xpath('..').find_element_by_link_text(choice1)

v2.click()

WebDriverWait(driver,10).until(
            EC.visibility_of_all_elements_located((
                By.CSS_SELECTOR,"#a_cont_cinema"))
            )

WebDriverWait(driver,10).until(
            EC.visibility_of_all_elements_located((
                By.CSS_SELECTOR,"#a_cont_cinema div div.time_inner div.time_box.time_list02 div dl"))
            )
v3 = driver.find_elements_by_css_selector("#a_cont_cinema div div.time_inner div.time_box.time_list02 div dl")

time = []
seat = []
for v in v3:
    v4 = v.find_element_by_tag_name("dt").text
    if (choice2 in v4):
        v5 = [x.text for x in v.find_elements_by_tag_name("a")][1:]
        for a in v5:
            li = a.split('\n')
            time.append(li[1][-5:])
            seat.append(li[2].replace('석','').replace(' ',''))
        break
info['time'] = time
info['seat'] = seat
info = json.dumps(info,separators=(',',':'))
driver.quit()

print(info)

