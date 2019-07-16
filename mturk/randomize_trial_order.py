import argparse
import pandas as pd
parser = argparse.ArgumentParser(description='Scrape Google images')
parser.add_argument('-t', '--trials', default='', type=str, help='trial file')
parser.add_argument('-n', '--num', default=10, type=int, help='how many randomizations to generate')
args = parser.parse_args()

try:
	trials = pd.read_csv(args.trials)
except:
	print 'Could not open file', filename

for i in range(args.num):
	trials = trials.sample(frac=1).reset_index(drop=True)
	trials.to_csv(args.trials[0:-4]+'_'+str(i)+'.csv',index=False)
