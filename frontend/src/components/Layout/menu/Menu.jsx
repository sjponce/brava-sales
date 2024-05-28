import { Link } from 'react-router-dom'
import { menuMaterialUser, menuMaterial } from '../../../utils/menuData'
import './menu.scss'
import { useSelector } from 'react-redux'
import { Typography } from '@mui/material'


export const Menu = () => {

  const switchMenu = () => {
    const userState = useSelector((store) => store.auth.current);
    return userState.role === "ADMIN" ? menuMaterial : menuMaterialUser
  }

  return (
    <div className='menu'>
      {switchMenu().map(item => (
        <div className='item' key={item.id}>
          <Typography variant='caption' className='title' sx={{opacity: 0.6}}>{item.title}</Typography>
          {item.listItems.map(listItem => (
            <Link to={listItem.url} className='listItem' key={listItem.title}>
              {listItem.icon}
              <Typography className='listItemTitle' variant='button'>{listItem.title}</Typography>
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}
