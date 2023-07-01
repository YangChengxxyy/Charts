import { UploadOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { AutoComplete, Button, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { WorkBook, read as readXlsx } from 'xlsx';

const Charts = () => {
  const [book, setBook] = useState<WorkBook>();
  useEffect(() => {
    console.log('🚀 ~ file: index.tsx:18 ~ Charts ~ book:', book);
  }, [book]);
  return (
    <PageContainer
      content={
        <Upload
          accept=".xls,.xlsx"
          beforeUpload={async (file) => {
            setBook(readXlsx(await file.arrayBuffer()));
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
        <ProForm
          onFinish={async (data) => {
            console.log(data);
          }}
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
          <ProFormSelect
            width="md"
            key="needSort"
            name="needSort"
            initialValue="N"
            label="是否需要排序"
            options={[
              { label: '是', value: 'Y' },
              { label: '否', value: 'N' },
            ]}
            required
          />
          <ProFormList
            name="rows"
            initialValue={[
              {
                name: '',
                letter: '',
              },
            ]}
            creatorButtonProps={{
              position: 'bottom',
              creatorButtonText: '再加一列',
            }}
            creatorRecord={() => {
              return { name: '', letter: '' };
            }}
          >
            <ProFormGroup key="group">
              <ProFormText
                key="name"
                name="name"
                width="sm"
                label="表头名"
                required
              />
              <ProFormText
                key="letter"
                name="letter"
                width="sm"
                label="表头字母"
                required
              />
            </ProFormGroup>
          </ProFormList>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};

export default Charts;
