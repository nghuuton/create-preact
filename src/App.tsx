import {
    Box,
    Button,
    createStyles,
    Divider,
    Grid,
    GridSize,
    makeStyles,
    Paper,
    Step,
    StepLabel,
    Stepper,
    Theme,
    Tooltip,
    useTheme,
    withStyles,
} from "@material-ui/core";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import React from "react";
import "./App.css";
import CustomAppBar from "./components/customAppBar";

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

const useStepButton = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        alternativeLabel: {
            flex: 0,
            position: "static",
        },
        horizontal: {
            border: "none",
        },
    })
);

const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        backgroundColor: "#fff",
        color: "rgba(0, 0, 0, 0.87)",
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
    },
    arrow: {
        "&::before": {
            backgroundColor: "#dadde9",
        },
    },
}))(Tooltip);

export interface LayoutI {
    gridSize: GridSize[][];
    page: number;
}

function App() {
    const classes = useStyles();
    const [layout, setLayout] = React.useState<LayoutI[]>([{ gridSize: [[6, 6]], page: 0 }]);
    const theme = useTheme();

    const classesStepButton = useStepButton();
    const [activeStep, setActiveStep] = React.useState(0);

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    function getStepContent(step: number) {
        return layout[step];
    }

    React.useEffect(() => {
        getStepContent(activeStep);
    }, [activeStep]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    function handleSetLayout(newGridSize: GridSize[]) {
        setLayout((prev) => [...prev.map((item) => (item.page === activeStep ? { ...item, gridSize: [...item.gridSize, newGridSize] } : item))]);
    }

    function handleDeleteGrid(indexRemove: number) {
        setLayout((prev) => [...prev.map((item) => ({ ...item, gridSize: [...item.gridSize.filter((xs, index) => index !== indexRemove)] }))]);
    }

    return (
        <div style={{ backgroundColor: "#fff", height: "100vh" }}>
            <CustomAppBar onSetLayout={handleSetLayout} />
            <Button onClick={() => setLayout((prev) => [...prev, { gridSize: [[12]], page: layout.length }])}>Add new layout</Button>
            <Grid
                container
                spacing={1}
                style={{ display: "flex", flexFlow: "row", justifyContent: "center", alignItems: "center", padding: 10, minHeight: 30 }}
            >
                <Box>
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                    </Button>
                </Box>
                <Grid container spacing={1}>
                    {layout[activeStep].gridSize.map((item, index) => {
                        return item.map((xs, j) => (
                            <Grid key={index} item xs={xs} onClick={() => handleDeleteGrid(index)} style={{ cursor: "pointer" }}>
                                <Paper className={classes.paper} variant="outlined" />
                            </Grid>
                        ));
                    })}
                </Grid>

                <Box>
                    <Button size="small" onClick={handleNext} disabled={activeStep === layout.length - 1}>
                        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </Button>
                </Box>
            </Grid>

            <Grid item xs={12} className="hidden-scroll">
                <Stepper alternativeLabel nonLinear activeStep={activeStep} connector={<></>} style={{ justifyContent: "center", margin: "0 auto" }}>
                    {layout.map((label, index) => {
                        return (
                            <Step key={index} classes={classesStepButton}>
                                <StepLabel
                                    StepIconComponent={() => (
                                        <div
                                            style={{
                                                minWidth: 50,
                                                height: 5,
                                                backgroundColor: activeStep === index ? "#f59a23" : "#7f7f7f",
                                                cursor: "pointer",
                                            }}
                                        ></div>
                                    )}
                                    onClick={handleStep(index)}
                                />
                            </Step>
                        );
                    })}
                </Stepper>
            </Grid>

            <Grid item xs={12} style={{ display: "flex", flexFlow: "row", alignItems: "center", justifyContent: "center" }}>
                <Box style={{ display: "flex" }}>
                    <Divider flexItem orientation="horizontal" style={{ height: "1.4px", width: 200, marginLeft: 5, marginRight: 5 }} />
                </Box>
            </Grid>
        </div>
    );
}

export default App;
