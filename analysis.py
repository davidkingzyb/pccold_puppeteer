# 2019/12/8 by DKZ
import os


def main(path):
    files=os.listdir(path)
    for file in files:
        analysis(path+file)

def analysis(filename):
    uenter_set=set()
    speaker_set=set()
    with open(filename,'r', encoding='UTF-8') as f:
        for line in f.readlines():
            try:
                if 'uenter' in line:
                    uenter_set.add(line.split(' @ ')[1])
                elif ' : ' in line:
                    speaker_set.add(line.split(' : ')[0])
                    if 'Pc冷冷' in line:
                        print(line.replace('\n',''))
            except Exception:
                print('err')
    print(filename,len(uenter_set),len(speaker_set))
    # print(speaker_set)

if __name__ == '__main__':
    main('./logfile/')
