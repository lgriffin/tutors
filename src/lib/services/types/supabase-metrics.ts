export interface LearningInteraction {
    id?: Date;
    loid?: string,
    courseid: string,
    studentid: string,
    date: Date;
    pageloads: number;
    timeactive: number;
};

export interface HeatMapSeriesData {
    name: string;
    type: string;
    top: string;
    data: number[][];
    label: { show: boolean; };
};

export interface LearningObject {
    route: string;
    loTitle: string;
    parentLoTitle: string | undefined;
    date: Date;
    pageLoads: number;
    timeActive: number;
    nickname: string;
};

export interface CalendarMap {
    date: string;
    timeActive: number;
};

export interface LabStepData {
    aggregatedTimeActive: number;
    title: string;
    loType: string;
}

export interface BoxplotData {
    value: [number, number, number, number, number];
    title: string;
    lowNickname: string;
    highNickname: string;
};

export type OuterPieData = {
    value: number;
    name: string;
    type: string;
  };