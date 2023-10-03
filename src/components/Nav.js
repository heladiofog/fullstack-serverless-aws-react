import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import {
  HomeOutlined,
  ProfileOutlined,
  FileProtectOutlined
} from '@ant-design/icons';

const Nav = (props) => {
  const { current, setCurrent } = props;
  console.log('Nav current: ' + current);

  const items = [
    {
      label: (<Link to='/'>Home</Link>),
      key: 'home',
      icon: <HomeOutlined />,
    },
    {
      label: (<Link to='/profile'>Profile</Link>),
      key: 'profile',
      icon: <ProfileOutlined />,
    },
    {
      label: (<Link to='/protected'>Protected</Link>),
      key: 'protected',
      icon: <FileProtectOutlined />,
    },
  ];

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return(
    <div>
      <Menu
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
        onClick={onClick}
      >
        {/* <Menu.Item key='home'>
          <Link to={`/`}>
            <HomeOutlined /> Home
          </Link>
        </Menu.Item>
        <Menu.Item key='profile'>
          <Link to={'/profile'}>
            <ProfileOutlined /> Profile
          </Link>
        </Menu.Item>
        <Menu.Item key='protected'>
          <Link to={'/protected'}>
            <FileProtectOutlined /> Protected
          </Link>
        </Menu.Item> */}
      </Menu>
    </div>
  );
}

export default Nav;
