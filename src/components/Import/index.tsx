import React from 'react';
import Papa, { ParseResult } from "papaparse"
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import { ref, set } from "firebase/database";
import { database } from '../../lib/firebase';

const { Dragger } = Upload;

type Data = {
  "Party Type": string
  "Name": string
  "Country": string
  "Buy Price": string
  "Sell Price": string
}

const uploadFile = (file: any) => {
  Papa.parse(file, {
    header: true,
    download: true,
    skipEmptyLines: true,
    delimiter: ",",
    complete: (results: ParseResult<Data>) => {
      let priceData = results.data.filter((item) => item['Name'].length > 0).map((item, index) => {
        return {
          key: index,
          type: item['Party Type'],
          name: item['Name'],
          country: item['Country'],
          buy: item['Buy Price'],
          sell: item['Sell Price']
        }
      })
      set(ref(database, '/tradePrice'), priceData)
    },
  })
}

const props: UploadProps = {
  name: 'file',
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  beforeUpload: (file) => {
    const isCSV = file.type === 'text/csv';
    if (!isCSV) {
      message.error(`${file.name} is not a csv file`);
    }
    return isCSV || Upload.LIST_IGNORE;
  },
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      uploadFile(info.file.originFileObj as RcFile)
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
    uploadFile(e.dataTransfer.files)
  }
};

const Import: React.FC = () => {  
  return (
    <Dragger {...props} style={{maxHeight: '200px'}}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to import</p>
      <p className="ant-upload-hint">
        Support for only CSV file
      </p>
    </Dragger>
  );
}

export default Import;