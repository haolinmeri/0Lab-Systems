#!/usr/bin/env python

#The script parses one email account and take the new email count and send it to the other email. I also used IFTTT to post a facebook status once the second email receives the new email count notice.

import feedparser		
import time	
import subprocess
import socket
from email.mime.text import MIMEText

user='yumengsystems'
passwd=''
emailNum = 0

while True: 	
    newmails = int(feedparser.parse("https://" + user + ":" + passwd + "@mail.google.com/gmail/feed/atom")["feed"]["fullcount"])
    
    def emailcount(n): #define function emailcount
        emailNum = n
        if n > 0: 
            print "you have "+str(emailNum)+" new email(s)"
        else: 
            print "you have no new email"

    emailcount(newmails) 
    time.sleep(5)

to = 'wangy594@newschool.com'
gmail_user = 'yumengsystems@gmail.com'
gmail_password = ''
smtpserver = smtplib.SMTP('smtp.gmail.com', 587)
smtpserver.ehlo()
smtpserver.starttls()
smtpserver.ehlo
smtpserver.login(gmail_user, gmail_password)

arg='new email count'
p=subprocess.Popen(arg,shell=True,stdout=subprocess.PIPE)
data = p.communicate()
split_data = data[0].split()
ipaddr = split_data[split_data.index('src')+1]
extipaddr = urllib2.urlopen("http://icanhazip.com").read()
#email_count = "hello"
#email_count = "you have "+str(emailNum)+" new email(s)"
msg = MIMEText(email_count)
msg['Subject'] = "New Email Report"
msg['From'] = gmail_user
msg['To'] = to

while True:
    if emailNum > 5:
        time.sleep(10)
        smtpserver.sendmail(gmail_user, [to], msg.as_string())
        smtpserver.quit()
