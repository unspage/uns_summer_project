from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import sys
import json
info={}
path="C:\\Users\\uns\\Downloads\\chromedriver"
driver = webdriver.Chrome(path)

driver.get('https://www.google.com/')

WebDriverWait(driver,10).until(
    EC.visibility_of_all_elements_located((
        By.CSS_SELECTOR,'#tsf'))
    )

inp = [x for x in driver.find_elements_by_css_selector("#tsf div")]

inp[1].find_element_by_css_selector('div div.RNNXgb div.SDkEP div.a4bIc input').send_keys('주변 영화관\n')
WebDriverWait(driver,10).until(
    EC.visibility_of_all_elements_located((
        By.CSS_SELECTOR,'#rso div.bkWMgd div div div.AEprdc.vk_c.ihlL4d div.xERobd'))
    )
v1 = [x for x in driver.find_elements_by_css_selector('#rso div.bkWMgd div div div.AEprdc.vk_c.ihlL4d div.xERobd div')]
v4 = [x.get_attribute('class') for x in v1]
#link_locator = (By.CSS_SELECTOR('#rso > div:nth-child(1) > div > div > div.AEprdc.vk_c.ihlL4d > div > div:nth-child(4)'))
#driver.find_element(*link_locator)
#'#rso div.bkWMgd div div div.AEprdc.vk_c.ihlL4d div.xERobd div:nth-child(4)'
#v2 = v1[3].find_element_by_css_selector('div.ccBEnf div.r-icg7VewuJNss div div a div div.dbg0pd span')
#print(v2)
info[1] = v1[25].find_element_by_tag_name('span').text
info[2] = v1[35].find_element_by_tag_name('span').text
info[3] = v1[45].find_element_by_tag_name('span').text

info = json.dumps(info, separators=(',',':'))

driver.quit()
print(info)