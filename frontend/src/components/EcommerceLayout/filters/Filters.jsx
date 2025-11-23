import { ArrowBackIosNew, DeleteSweep, ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import crud from '@/redux/crud/actions';
import cart from '@/redux/cart/actions';
import { selectSelectedTags } from '@/redux/cart/selectors';

const drawerWidth = 300;

const Filters = ({ open, toggleDrawer }) => {
  const [tags, setTags] = useState([]);
  const dispatch = useDispatch();
  const tagsState = useSelector((store) => store.crud.list);
  const selectedTags = useSelector(selectSelectedTags);
  const [openCategories, setOpenCategories] = useState({});

  // TODO: Derivar a backend la categorizacion de los tags
  useEffect(() => {
    if (!tagsState?.result?.items) return;
    const newTags = tagsState.result.items.map((item) => ({ ...item, id: item._id }));

    const groupedTags = newTags.reduce((acc, tag) => {
      if (!acc[tag.category]) {
        acc[tag.category] = [];
      }
      acc[tag.category].push({ id: tag._id, name: tag.name });
      return acc;
    }, {});
    setTags(groupedTags);
  }, [tagsState?.result]);

  const updateTags = () => {
    if (tagsState?.isLoading) return;
    dispatch(crud.list({ entity: 'tag', options: { page: 1, items: 500 } }));
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

  const handleTagClick = (tagId, category) => {
    const payload = { tagId, category };
    if (
      selectedTags[category]?.includes(tagId)
    ) {
      dispatch(cart.deselectTagFilter(payload));
    } else {
      dispatch(cart.selectTagFilter(payload));
    }
  };

  const handleResetFilters = () => {
    dispatch(cart.resetTagFilters());
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mx={2}>
          <Typography variant="overline">Filtrar por tags:</Typography>
          <Tooltip title="Resetear filtros" arrow>
            <IconButton size="small" aria-label="reset filters" onClick={handleResetFilters}>
              <DeleteSweep />
            </IconButton>
          </Tooltip>
        </Box>
        <List>
          {Object.keys(tags).map((category) => (
            <React.Fragment key={category}>
              <ListItemButton onClick={() => handleCategoryClick(category)}>
                <ListItemText primary={capitalizeFirstLetter(category)} />
                {openCategories[category] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openCategories[category]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {tags[category].map((tag) => (
                    <ListItemButton
                      key={tag.id}
                      onClick={() => handleTagClick(tag.id, category)}
                      sx={{
                        pl: 4,
                        backgroundColor: selectedTags[category]?.includes(tag.id)
                          ? 'action.selected'
                          : 'transparent',
                      }}
                    >
                      <ListItemText primary={tag.name} />
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
