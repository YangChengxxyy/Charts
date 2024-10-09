import Sankey from '@/components/Sankey/Sankey';
import {
  DownloadOutlined,
  RestOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { App, AutoComplete, Button, Space, Upload, message } from 'antd';
import { useRef, useState } from 'react';
import { WorkBook, read as readXlsx, utils } from 'xlsx';

import { groupBy, isNil } from 'lodash';

type FormProps = {
  sheetName: string;
  nodeSort: 'N' | 'SB' | 'BS';
  haveHeader: 'Y' | 'N';
  position: string;
};

const Charts = () => {
  const [book, setBook] = useState<WorkBook>();

  const [data, setData] = useState<
    { source: string; target: string; value: number }[]
  >([]);

  const [formData, setFormData] = useState<FormProps>();

  const sankeyRef = useRef<any>(null);

  const onFinish: (formData: FormProps) => Promise<boolean | void> = async (
    data,
  ) => {
    const { haveHeader: nH, position } = data;
    const haveHeader = nH === 'Y';

    if (book) {
      const sheet = book.Sheets[data.sheetName];
      if (!sheet) {
        message.error('请输入正确的SheetNames');
        return;
      }

      const refString = position.trim() || sheet['!ref']!;
      const ref = utils.decode_range(refString);
      console.log("🚀 ~ Charts ~ ref:", ref)
      const { s: start, e: end } = ref;

      const columns: (string | number)[][] = new Array(end.c - start.c + 1)
        .fill(0)
        .map(() => []);

      const rows: (string | number)[][] = new Array(end.r - start.r + 1)
        .fill(0)
        .map(() => []);

      for (let r = haveHeader ? start.r + 1 : start.r; r <= end.r; r++) {
        for (let c = start.c; c <= end.c; c++) {
          const position = utils.encode_cell({ c, r });
          if (!columns[c]) {
            columns[c] = [];
          }
          columns[c][haveHeader ? r - 1 : r] = sheet[position]?.v;

          rows[haveHeader ? r - 1 : r][c] = sheet[position]?.v;
        }
      }

      const res = rows.reduce<
        {
          source: string;
          target: string;
          value: number;
          flag: number;
        }[]
      >((pre, curr) => {
        const size = curr.length;
        if (size < 3) {
          return pre;
        }
        for (let i = 0; i < size - 3 + 1; i = i + 2) {
          const temp = curr.slice(i, i + 3);
          const finder = pre.find((v) => {
            return v.source === temp[0] && v.target === temp[2];
          });
          if (finder) {
            const v = temp[1];
            finder.value += typeof v === 'number' ? v : parseFloat(v);
          } else {
            if (isNil(temp[0]) || isNil(temp[1])) {
              return pre;
            }
            pre.push({
              source: `${temp[0]}`,
              value:
                typeof temp[1] === 'number' ? temp[1] : parseFloat(temp[1]),
              target: `${temp[2]}`,
              flag: i / 2,
            });
          }
        }
        return pre;
      }, []);
      console.log('🚀 ~ Charts ~ res:', res);

      const temp = groupBy(res, 'flag');

      const d = [];

      const sortMap = {
        SB: (
          a: {
            source: string;
            target: string;
            value: number;
            flag: number;
          },
          b: {
            source: string;
            target: string;
            value: number;
            flag: number;
          },
        ) => a.value - b.value,
        BS: (
          a: {
            source: string;
            target: string;
            value: number;
            flag: number;
          },
          b: {
            source: string;
            target: string;
            value: number;
            flag: number;
          },
        ) => b.value - a.value,
        N: () => 0,
      };

      for (let k in temp) {
        if (temp.hasOwnProperty(k)) {
          d.push(...temp[k].sort(sortMap[data.nodeSort]));
        }
      }

      setData(d);
      setFormData(data);
    }
  };
  return (
    <App>
      <PageContainer
        content={
          <Upload
            accept=".xls,.xlsx"
            maxCount={1}
            beforeUpload={async (file) => {
              const book = readXlsx(await file.arrayBuffer());
              setBook(book);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />} type="primary">
              上传表格
            </Button>
          </Upload>
        }
      >
        <ProCard>
          <ProForm<FormProps>
            submitter={{
              searchConfig: { submitText: '绘制', resetText: '重置' },
            }}
            onFinish={onFinish}
            disabled={!book}
          >
            <ProForm.Item
              key="sheetName"
              name="sheetName"
              label="SheetName"
              initialValue=""
              required
            >
              <AutoComplete
                options={book?.SheetNames?.map((item) => ({ value: item }))}
              />
            </ProForm.Item>
            <ProFormGroup>
              <ProFormText
                width="md"
                key="position"
                name="position"
                initialValue=""
                label="位置"
              />
              <ProFormSelect
                width="md"
                key="nodeSort"
                name="nodeSort"
                initialValue="N"
                label="排序方式"
                options={[
                  { label: '不需要', value: 'N' },
                  { label: '大到小', value: 'BS' },
                  { label: '小到大', value: 'SB' },
                ]}
                required
              />
              <ProFormSelect
                width="md"
                key="haveHeader"
                name="haveHeader"
                initialValue="Y"
                label="是否有表头"
                options={[
                  { label: '是', value: 'Y' },
                  { label: '否', value: 'N' },
                ]}
                required
              />
            </ProFormGroup>
          </ProForm>
        </ProCard>
        {data.length === 0 ? null : (
          <ProCard
            style={{ marginTop: 24 }}
            extra={
              <Space>
                <Button
                  onClick={() => {
                    sankeyRef.current
                      .getChart()
                      .downloadImage(formData?.sheetName, undefined, '#fff');
                  }}
                  type="primary"
                  icon={<DownloadOutlined />}
                >
                  保存
                </Button>
                <Button
                  onClick={() => {
                    setData([]);
                  }}
                  icon={<RestOutlined />}
                >
                  删除
                </Button>
              </Space>
            }
          >
            <div>
              <Sankey ref={sankeyRef} data={data} />
            </div>
          </ProCard>
        )}
      </PageContainer>
    </App>
  );
};

export default Charts;
