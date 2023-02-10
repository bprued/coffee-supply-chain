import React, { useEffect, useState } from 'react';
import { Button, List, Skeleton } from 'antd';
import { database } from '../../lib/firebase';
import { ref, child, push, update, get } from "firebase/database";

interface DataType {
  gender?: string;
  name: {
    title?: string;
    first?: string;
    last?: string;
  };
  email?: string;
  picture: {
    large?: string;
    medium?: string;
    thumbnail?: string;
  };
  nat?: string;
  loading: boolean;
}

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

const db = database
const dbRef = ref(db);

const Trade: React.FC = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [list, setList] = useState<DataType[]>([]);
  const [newKey, setNewKey] = useState(0);

  useEffect(() => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        setInitLoading(false);
        setData(res.results);
        setList(res.results);
      });

    get(child(dbRef, `tradePrice`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        setNewKey(snapshot.val().length)
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }, []);
  

  const onLoadMore = () => {
    setLoading(true);
    setList(
      data.concat([...new Array(count)].map(() => ({ loading: true, name: {}, picture: {} }))),
    );
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        const newData = data.concat(res.results);
        setData(newData);
        setList(newData);
        setLoading(false);
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event('resize'));
      });
  };

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;

  const handleBuyClicked = () => {
    
    const postData = {
      key: '123',
      name: 'test',
      type: 'test',
      country: 'test',
      buy: '11111',
      sell: '990909'
    };
  
    // Get a key for a new Post.
    // const newKey = push(child(ref(db), 'tradePrice/')).key;
    console.log(newKey)
  
    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates: { [key: string]: any; } = {};
    updates['/tradePrice/' + newKey] = postData;
    // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
  
    return update(ref(db), updates);
  }

  return (
    <>
      <Button onClick={handleBuyClicked}>Buy</Button>
      <Button>Sell</Button>
      <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            actions={[<span>edit</span>, <span>more</span>]}
          >
            <Skeleton title={false} loading={item.loading} active>
              <List.Item.Meta
                title={<a href="https://ant.design">{item.name?.last}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
              <div>content</div>
            </Skeleton>
          </List.Item>
        )}
      />
    </>
    
  );
};

export default Trade;