import { AppBar, Button, createStyles, Divider, Grid, GridSize, makeStyles, Menu, MenuItem, Paper, Theme, Toolbar } from "@material-ui/core";
import React from "react";

const useStylesAppBar = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: "40px",
            backgroundColor: "#169bd5",
        },
    })
);

const useStylesToolbar = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: "40px",
            minHeight: "40px",
            display: "flex",
        },
    })
);

const useStylesButton = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: "20px",
            "&:hover": {
                backgroundColor: "transparent",
            },
        },
        text: {
            color: "#fff",
            textTransform: "none",
        },
    })
);

const useStylesMenu = makeStyles<Theme>(() => ({
    paper: {
        minWidth: 100,
        borderRadius: 0,
    },
    list: {
        padding: 0,
    },
}));

const useStylesMenuItem = makeStyles<Theme>(() => ({
    gutters: {
        "&:hover": {
            color: "",
            backgroundColor: "#169bd5",
        },
    },
}));

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 70,
        width: "100%",
    },
    grid: {
        backgroundColor: "red",
    },
    paperGrid: {
        height: 30,
        width: "100%",
        background: "#ccc",
    },
    menuButton: {},
    title: {
        flexGrow: 1,
    },
});

export interface CustomAppBarProps {
    onSetLayout: (layout: GridSize[]) => void;
}

const CustomAppBar: React.FC<CustomAppBarProps> = ({ onSetLayout }) => {
    const classesAppbar = useStylesAppBar();
    const classesToolbar = useStylesToolbar();
    const classesButton = useStylesButton();
    const classesMenu = useStylesMenu();
    const classesMenuItem = useStylesMenuItem();
    const classes = useStyles();

    const [layoutController, setLayoutController] = React.useState<GridSize[][]>([[12], [6, 6], [3, 9], [9, 3], [4, 4, 4]]);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <AppBar position="static" classes={classesAppbar}>
            <Toolbar classes={classesToolbar}>
                <Button classes={classesButton} variant="text" disableElevation size="small">
                    Dashboard
                </Button>
                <Divider variant="middle" orientation="vertical" style={{ backgroundColor: "#afdcf0", height: "20px", marginLeft: 5, marginRight: 5 }} />
                <Button classes={classesButton} variant="text" disableElevation size="small" onClick={handleClick}>
                    Open Menu
                </Button>
                <Menu
                    id="simple-menu"
                    classes={classesMenu}
                    className={classesMenu.root}
                    anchorEl={anchorEl}
                    keepMounted
                    elevation={0}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ horizontal: "center", vertical: 0 }}
                >
                    <Divider />
                    {layoutController.map((item) => (
                        <>
                            <MenuItem
                                classes={classesMenuItem}
                                onClick={() => {
                                    onSetLayout(item);
                                }}
                            >
                                <Grid container spacing={1}>
                                    {item.map((grid) => (
                                        <Grid item xs={grid}>
                                            <Paper className={classes.paperGrid} elevation={0} variant="outlined" square />
                                        </Grid>
                                    ))}
                                </Grid>
                            </MenuItem>
                            <Divider />
                        </>
                    ))}
                </Menu>
                <Divider variant="middle" orientation="vertical" style={{ backgroundColor: "#afdcf0", height: "20px", marginLeft: 5, marginRight: 5 }} />
            </Toolbar>
        </AppBar>
    );
};

export default CustomAppBar;
