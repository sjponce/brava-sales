import { ArrowBackIosNew, ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Toolbar,
  Tooltip,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import crud from '@/redux/crud/actions';

const drawerWidth = 300;

const Filters = ({ open, toggleDrawer }) => {
  const [tags, setTags] = useState([]);
  const dispatch = useDispatch();
  const tagsState = useSelector((store) => store.crud.listAll);
  const [openCategories, setOpenCategories] = useState({});

  // TODO: Derivar a backend la categorizacion de los tags
  useEffect(() => {
    if (!tagsState?.result) return;
    const newTags = tagsState.result?.items?.result.map((item) => ({ ...item, id: item._id }));
    const groupedTags = newTags.reduce((acc, tag) => {
      if (!acc[tag.category]) {
        acc[tag.category] = [];
      }
      acc[tag.category].push(tag.name);
      return acc;
    }, {});
    setTags(groupedTags);
  }, [tagsState]);

  const updateTags = () => {
    if (tagsState?.isLoading) return;
    dispatch(crud.listAll({ entity: 'tag' }));
  };

  useEffect(() => {
    updateTags();
  }, []);

  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  const handleCategoryClick = (category) => {
    setOpenCategories((prevOpenCategories) => ({
      ...prevOpenCategories,
      [category]: !prevOpenCategories[category],
    }));
  };

  return (
    <Drawer anchor="left" open={open} variant="temporary" onClose={() => toggleDrawer(false)}>
      <Box sx={{ overflow: 'auto', width: { xs: '100vw', sm: drawerWidth }, display: 'flex', flexDirection: 'column' }}>
        <Toolbar>
          <Tooltip title="Ocultar" arrow>
            <IconButton aria-label="hide" onClick={() => toggleDrawer()} sx={{ ml: 'auto' }}>
              <ArrowBackIosNew />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <List subheader={<ListSubheader>Filtrar por tags</ListSubheader>}>
          {Object.keys(tags).map((category) => (
            <React.Fragment key={category}>
              <ListItemButton onClick={() => handleCategoryClick(category)}>
                <ListItemText primary={capitalizeFirstLetter(category)} />
                {openCategories[category] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openCategories[category]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {tags[category].map((tag) => (
                    <ListItemButton key={tag} sx={{ pl: 4 }}>
                      <ListItemText primary={tag} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Filters;
