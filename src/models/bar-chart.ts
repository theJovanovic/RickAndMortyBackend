export interface Series {
    name: string,
    data: number[]
}

export interface BarChart {
    chart: {
        type: string
    },
    title: {
        text: string
    },
    xAxis: {
        categories: string[]
    },
    yAxis: {
        title: {
            text: string
        }
    },
    plotOptions: {
        column: {
            pointPadding: number,
            groupPadding: number
        }
    },
    series: Series[]
}