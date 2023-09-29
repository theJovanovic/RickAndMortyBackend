
export interface Data {
    name: string,
    y: number
}

export interface Series {
    name: string,
    data: Data[]
}

export interface PieChart {
    chart: {
        type: string
    }
    title: {
        text: string
    }
    series: Series[]
}