import { Link } from 'react-router-dom';
import './menu.scss';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { menuMaterialUser, menuMaterial, menuMaterialSellers } from '../../../utils/menuData';

const Menu = () => {
  const switchMenu = () => {
    const userState = useSelector((store) => store.auth.current);
    if (userState.role === 'admin') {
      return menuMaterial;
    }
    if (userState.role === 'seller') {
      return menuMaterialSellers;
    }
    return menuMaterialUser;
  };

  return (
    <div className="menu">
      {switchMenu().map((item) => (
        <div className="item" key={item.id}>
          <Typography variant="caption" className="title" sx={{ opacity: 0.6 }} color="primary">
            {item.title}
          </Typography>
          {item.listItems.map((listItem) => (
            <Link to={listItem.url} className="listItem" key={listItem.title}>
              {listItem.icon}
              <Typography className="listItemTitle" variant="button">
                {listItem.title}
              </Typography>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
