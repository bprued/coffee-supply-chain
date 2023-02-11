import React, { useEffect, useState } from "react";
import { Button, List, Modal, Form, Input, InputNumber } from "antd";
import { database } from "../../lib/firebase";
import { ref, child, update, get } from "firebase/database";

interface DataType {
  key: string;
  type: string;
  name: string;
  country: string;
  buy: number;
  sell: number;
}

const db = database;
const dbRef = ref(db);

const Trade: React.FC = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [data, setData] = useState<DataType[]>([]);
  const [newKey, setNewKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDatabase = () => {
    get(child(dbRef, `tradePrice`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          setNewKey(snapshot.val().length);
          setData(snapshot.val().reverse())
          setInitLoading(false)
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchDatabase();
  }, []);

  const showModal = () => {
    // fetchDatabase()
    setIsModalOpen(true);
  };

  const handleOk = (value: any) => {
    setIsModalOpen(false);
    const newData = {
      key: newKey,
      name: value.name,
      type: value.type,
      country: value.country,
      buy: value.buy,
      sell: value.sell,
    };
    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates: { [key: string]: any } = {};
    updates["/tradePrice/" + newKey] = newData;

    return update(ref(db), updates);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values: any) => {
    handleOk(values);
    fetchDatabase()
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Trade
      </Button>
      <Modal
        title="Trade Details"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[]}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Party Type"
            name="type"
            rules={[{ required: true, message: "Please input your party type" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Party Name"
            name="name"
            rules={[{ required: true, message: "Please input your party name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please input your country" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Sell Price"
            name="sell"
            rules={[{ required: true, message: "Please input your sell price" }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="Buy Price"
            name="buy"
            rules={[{ required: true, message: "Please input your buy price" }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button key="back" onClick={handleCancel} style={{marginLeft: '20px'}}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <List
        style={{    
          height: '450px',
          overflow: 'scroll',
          marginTop: '50px'
        }}
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={[<span>Buy: {item.buy || '-'}</span>, <span>Sell: {item.sell || '-'}</span>]}>
              <List.Item.Meta
                title={<span>{item.name}</span>}
                description={item.country}
              />
              <div>{item.type}</div>
          </List.Item>
        )}
      />
    </>
  );
};

export default Trade;
