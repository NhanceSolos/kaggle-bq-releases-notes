from flask import Flask, render_template, jsonify
import feedparser
from bs4 import BeautifulSoup
import re
from datetime import datetime

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

def clean_html_content(html_str):
    """
    Cleans up HTML if needed, e.g., standardizing links to open in a new tab.
    """
    if not html_str:
        return ""
    soup = BeautifulSoup(html_str, 'html.parser')
    for a in soup.find_all('a'):
        a['target'] = '_blank'
        a['rel'] = 'noopener noreferrer'
    return str(soup)

def extract_text_for_tweet(html_str):
    """
    Converts HTML content into plain text and formats it for use in a tweet.
    """
    if not html_str:
        return ""
    soup = BeautifulSoup(html_str, 'html.parser')
    
    # Remove link tags but keep the text
    text = soup.get_text()
    # Normalize whitespaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/fetch-notes')
def fetch_notes():
    try:
        # Fetch and parse feed
        feed = feedparser.parse(FEED_URL)
        
        if not feed.entries:
            return jsonify({"error": "No entries found or failed to fetch feed."}), 500
            
        all_updates = []
        
        for entry in feed.entries:
            # Entry title is usually the date (e.g. "June 17, 2026")
            date_str = entry.title
            
            # Format update date if possible
            updated_raw = entry.get('updated', '')
            try:
                # Try to parse standard ISO format (e.g. 2026-06-17T00:00:00-07:00)
                dt = datetime.fromisoformat(updated_raw)
                formatted_date = dt.strftime("%B %d, %Y")
            except:
                formatted_date = date_str
                
            content_html = entry.summary
            if not content_html and 'content' in entry:
                content_html = entry.content[0].value
                
            if not content_html:
                continue
                
            soup = BeautifulSoup(content_html, 'html.parser')
            h3s = soup.find_all('h3')
            
            # If the entry has no h3 tags, we treat the whole content as one update
            if not h3s:
                plain_text = extract_text_for_tweet(content_html)
                all_updates.append({
                    "date": formatted_date,
                    "raw_date": updated_raw,
                    "type": "General",
                    "content": clean_html_content(content_html),
                    "plain_text": plain_text,
                    "feed_link": entry.link,
                    "id": entry.get('id', '')
                })
                continue
                
            # If there are h3 tags, split them into sub-updates
            for idx, h3 in enumerate(h3s):
                update_type = h3.get_text().strip()
                
                # Collect all siblings until the next h3
                siblings = []
                curr = h3.next_sibling
                while curr and curr.name != 'h3':
                    if curr.name or (isinstance(curr, str) and curr.strip()):
                        siblings.append(curr)
                    curr = curr.next_sibling
                
                # Form sub-update HTML
                sub_html = "".join(str(s) for s in siblings).strip()
                sub_text = extract_text_for_tweet(sub_html)
                
                # Unique ID for UI selection
                entry_id = entry.get('id', '')
                unique_id = f"{entry_id}#sub-{idx}" if entry_id else f"{formatted_date}-{update_type}-{idx}"
                
                all_updates.append({
                    "id": unique_id,
                    "date": formatted_date,
                    "raw_date": updated_raw,
                    "type": update_type,
                    "content": clean_html_content(sub_html),
                    "plain_text": sub_text,
                    "feed_link": entry.link
                })
                
        return jsonify({
            "success": True,
            "feed_title": feed.feed.get('title', 'BigQuery Release Notes'),
            "feed_link": feed.feed.get('link', 'https://cloud.google.com/bigquery/docs/release-notes'),
            "updated": feed.feed.get('updated', ''),
            "updates": all_updates
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
