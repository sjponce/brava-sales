import { AirportShuttleOutlined, FeedOutlined, HomeOutlined, InsertChartOutlined, LocalAtmRounded, PeopleAltOutlined, SellOutlined, ShoppingBagOutlined, WorkOutlineRounded } from "@mui/icons-material";


export const menuMaterial = [
  {
    id: 1,
    title: "Dashboard",
    listItems: [
      {
        id: 1,
        title: "Home",
        url: "/",
        icon: <HomeOutlined />,
      },
    ],
  },
  {
    id: 2,
    title: "Administrar",
    listItems: [
      {
        id: 1,
        title: "Clientes",
        url: "",
        icon: <PeopleAltOutlined />,
      },
      {
        id: 3,
        title: "Vendedores",
        url: "",
        icon: <WorkOutlineRounded />,
      },
      {
        id: 4,
        title: "Productos",
        url: "",
        icon: <SellOutlined />,
      },
    ],
  },
  {
    id: 3,
    title: "Ventas",
    listItems: [
      {
        id: 1,
        title: "Viajes",
        url: "inputs",
        icon: <AirportShuttleOutlined />,
      },

      {
        id: 2,
        title: "Pedidos",
        url: "outputs",
        icon: <ShoppingBagOutlined />,
      },
      {
        id: 3,
        title: "Promociones",
        url: "outputs",
        icon: <LocalAtmRounded />,
      },
    ],
  },
  {
    id: 4,
    title: "Reportes",
    listItems: [
      {
        id: 1,
        title: "Informes",
        url: "/",
        icon: <FeedOutlined />,
      },
      {
        id: 2,
        title: "Estadísticas",
        url: "/",
        icon: <InsertChartOutlined />,
      },

    ],
  },
];

export const menuMaterialUser = [
  {
    id: 1,
    title: "Dashboard",
    listItems: [
      {
        id: 1,
        title: "Home",
        url: "/",
        icon: <HomeOutlined />,
      },
    ],
  },
  {
    id: 2,
    title: "Administrar",
    listItems: [
      {
        id: 1,
        title: "Clientes",
        url: "",
        icon: <PeopleAltOutlined />,
      },
    ],
  },
  {
    id: 3,
    title: "Ventas",
    listItems: [
      {
        id: 1,
        title: "Viajes",
        url: "inputs",
        icon: <AirportShuttleOutlined />,
      },
      {
        id: 2,
        title: "Pedidos",
        url: "outputs",
        icon: <ShoppingBagOutlined />,
      },
      {
        id: 3,
        title: "Promociones",
        url: "outputs",
        icon: <LocalAtmRounded />,
      },
    ],
  },
  {
    id: 4,
    title: "Reportes",
    listItems: [
      {
        id: 1,
        title: "Informes",
        url: "/",
        icon: <FeedOutlined />,
      },
      {
        id: 2,
        title: "Estadísticas",
        url: "/",
        icon: <InsertChartOutlined />,
      },
    ],
  },
];
