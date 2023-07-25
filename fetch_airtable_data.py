from pyairtable import Table
import pandas as pd
import numpy as np
import os

AIRTABLE_ACCESS_TOKEN = os.environ.get("AIRTABLE_ACCESS_TOKEN")
AIRTABLE_BASE_ID = os.environ.get("AIRTABLE_BASE_ID")

table = Table(AIRTABLE_ACCESS_TOKEN, AIRTABLE_BASE_ID, 'Main')
data = table.all()
df = pd.DataFrame([c['fields'] for c in data])
df.replace(to_replace=np.NaN,value="").to_json('policyTacker_latest.json')