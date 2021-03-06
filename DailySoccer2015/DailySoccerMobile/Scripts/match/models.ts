﻿module app.match {
    'use strict';

    export class LeagueInformation {
        Name: string;
        Matches: MatchInformation[];
    }

    export class MatchInformation {
        id: string;
        TeamHomeId: string;
        TeamHomeName: string;
        TeamHomeScore: number;
        TeamHomePoint: number;
        TeamAwayId: string;
        TeamAwayName: string;
        TeamAwayScore: number;
        TeamAwayPoint: number;
        DrawPoints: number;
        BeginDate: Date;
        StartedDate: Date;
        CompletedDate: Date;
        LeagueId: number;
        LeagueName: string;
        Status: string;
        IsTeamHomeWin: boolean;
        IsTeamAwayWin: boolean;
        IsGameDraw: boolean;
    }

    export class PredictionInformation {
        MatchId: string;
        IsPredictionTeamHome: boolean;
        IsPredictionTeamAway: boolean;
        IsPredictionDraw: boolean;
        PredictionPoints: number;
    }

    export class PredictionDailyDetail {
        TeamHomeName: string;
        TeamAwayName: string;
        TeamHomeScore: number;
        TeamAwayScore: number;
        IsMatchFinish: boolean;
        IsPredictionTeamHome: boolean;
        IsPredictionTeamAway: boolean;
        IsPredictionDraw: boolean;
        GainPoints: number;
    }

    export class PredictionMonthlySummary {
        Date: Date;
        TotalPoints: number;
    }

    export class PredictionDailySummary {
        Date: Date;
        TotalPoints: number;
        PredictionResults: PredictionDailyDetail[];
    }

    export class PredictionRequest {
        constructor(public id: string, public MatchId: string, public TeamId: string, public IsCancel: boolean) { }
    }

    export class HistoryMonthlyRequest {
        constructor(public id: string) { }
    }

    export class HistoryDailyRequest {
        constructor(public id: string, public year: number, public month: number) { }
    }
    
}