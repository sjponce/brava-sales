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

const Filters = ({ open, toggleDrawer, products = [] }) => {
  const [tags, setTags] = useState([]);
  const dispatch = useDispatch();
  const tagsState = useSelector((store) => store.crud.list_tag);
  const selectedTags = useSelector(selectSelectedTags);
  const [openCategories, setOpenCategories] = useState({});

  // TODO: Derivar a backend la categorizacion de los tags
  useEffect(() => {
    if (!tagsState?.result?.items) return;
    const newTags = tagsState.result.items.map((item) => ({ ...item, id: item._id }));

    // Extraer IDs de tags que existen en los productos
    const availableTagIds = new Set();
    products.forEach((product) => {
      if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach((tagId) => availableTagIds.add(tagId));
      }
    });

    // Filtrar tags para mostrar solo los que existen en los productos
    const groupedTags = newTags.reduce((acc, tag) => {
      if (availableTagIds.has(tag._id)) {
        if (!acc[tag.category]) {
          acc[tag.category] = [];
        }
        acc[tag.category].push({ id: tag._id, name: tag.name });
      }
      return acc;
    }, {});
    setTags(groupedTags);
  }, [tagsState?.result, products]);

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
                  {tags[category].map((tag) => {
                    const isSelected = selectedTags[category]?.includes(tag.id);
                    return (
                      <ListItemButton
                        key={tag.id}
                        onClick={() => handleTagClick(tag.id, category)}
                        sx={{
                          pl: 4,
                          backgroundColor: isSelected ? 'primary.lighter' : 'transparent',
                          borderLeft: 4,
                          borderColor: isSelected ? 'primary.main' : 'transparent',
                          '&:hover': { backgroundColor: 'action.hover' },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <ListItemText
                          primary={tag.name}
                          primaryTypographyProps={{
                            sx: {
                              fontWeight: isSelected ? 600 : 400,
                              color: isSelected ? 'primary.main' : 'text.primary',
                            }
                          }}
                        />
                        {isSelected && (
                          <Box
                            sx={{
                              ml: 'auto',
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: 'primary.main',
                            }}
                          />
                        )}
                      </ListItemButton>
                    );
                  })}
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
