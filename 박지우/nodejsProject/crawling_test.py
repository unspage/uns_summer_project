from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import sys
import json

info = {}
choice1 = " "+sys.argv[1].replace(" ","")
choice2 = sys.argv[2]
path="C:\\Users\\uns\\Downloads\\chromedriver"

chrome_options = webdriver.ChromeOptions()
# 빠르게하기
prefs = {'profile.managed_default_content_settings.images': 2}
chrome_options.add_experimental_option('prefs', prefs)
chrome_options.add_argument('headless')
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('lang=ko_KR')


driver = webdriver.Chrome(path, chrome_options=chrome_options)
driver.get('http://ticket.cgv.co.kr/Reservation/Reservation.aspx?MOVIE_CD=&MOVIE_CD_GROUP=&PLAY_YMD=&THEATER_CD=&PLAY_NUM=&PLAY_START_TM=&AREA_CD=&SCREEN_CD=&THIRD_ITEM=')

# movie = driver.find_element_by_css_selector("#gnb_list li.booking a")
# close = driver.find_element_by_id('open_today')
# close.click()
# movie.click()
# driver.switch_to.frame(driver.find_element_by_id("ticket_iframe"))


WebDriverWait(driver,10).until(
    EC.visibility_of_all_elements_located((
        By.CSS_SELECTOR,"#movie_list ul"))
    )
movielist = driver.find_element_by_css_selector("#movie_list ul")
WebDriverWait(driver,10).until(
            EC.visibility_of_all_elements_located((
                By.CSS_SELECTOR,"#movie_list ul li"))
            )
options = [x for x in movielist.find_elements_by_tag_name("li")]
for a in options:
    target = a.find_element_by_css_selector("a")
    driver.implicitly_wait(10)
    name = target.text
    if(name==choice1):
        WebDriverWait(driver,10).until(
            EC.element_to_be_clickable((
                By.CSS_SELECTOR,"#movie_list ul li a"))
            )
        target.click()
        
        WebDriverWait(driver,10).until(
            EC.element_to_be_clickable((
                By.CSS_SELECTOR,"#sbmt_all a"))
            )   
        driver.find_element_by_css_selector("#sbmt_all a").click()
        break

WebDriverWait(driver,10).until(
            EC.visibility_of_all_elements_located((
                By.CSS_SELECTOR,"#theater_area_list ul li.selected div ul li a"))
            )


theaterlist=driver.find_element_by_css_selector("#theater_area_list ul li.selected div ul")
options = [x for x in theaterlist.find_elements_by_tag_name("li")]


for a in options:
    target = a.find_element_by_tag_name("a")
    name = target.text
    if(name==choice2):
        WebDriverWait(driver,20).until(
            EC.element_to_be_clickable((
                By.CSS_SELECTOR,"#theater_area_list ul li.selected div ul li a"))
            )
        a.find_element_by_tag_name("a").click()
        break

WebDriverWait(driver,20).until(
            EC.visibility_of_all_elements_located((
                By.TAG_NAME,"#date_list"))
            )

day = driver.find_element_by_css_selector("#date_list ul div li.day a")

WebDriverWait(driver,10).until(
            EC.visibility_of_all_elements_located((
                By.CSS_SELECTOR,"#date_list ul div li.day a"))
            )

WebDriverWait(driver,10).until(
            EC.element_to_be_clickable((
                By.CSS_SELECTOR,"#date_list ul div li.day a"))
            )


day.click()

WebDriverWait(driver,10).until(
            EC.visibility_of_all_elements_located((
                By.CSS_SELECTOR,"#ticket div.steps div.step.step1 div.section.section-time div.col-body"))
            )

timediv = driver.find_element_by_css_selector("#ticket div.steps div.step.step1"+
                                                " div.section.section-time div.col-body")

timelist = [x for x in timediv.find_elements_by_tag_name("li")]
time = []
seat = []
for a in timelist:
    if ((a.find_element_by_css_selector("span.count").text)!="예매종료"):
        time.append(a.find_element_by_css_selector("a span.time").text)
        seat.append((a.find_element_by_css_selector("span.count").text)[:-1])
        continue

info["time"] = time
info["seat"] = seat
info = json.dumps(info, separators=(',',':'))

driver.quit()

print(info)


