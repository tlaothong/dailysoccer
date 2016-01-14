﻿using ApiApp.Models;
using ApiApp.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ApiApp.Controllers
{
    /// <summary>
    /// Predictions API
    /// </summary>
    [RoutePrefix("api/predictions")]
    public class PredictionsController : ApiController
    {
        private IMatchesRepository _matchesRepo;
        private IPredictionRepository _predictionRepo;
        private IAccountRepository _accountRepo;

        /// <summary>
        /// Initialize Prediction API
        /// </summary>
        /// <param name="matchesRepo">Matches repository</param>
        /// <param name="predictionRepo">Prediction repository</param>
        /// <param name="accountRepo">Account repository</param>
        public PredictionsController(IMatchesRepository matchesRepo, IPredictionRepository predictionRepo, IAccountRepository accountRepo)
        {
            _matchesRepo = matchesRepo;
            _predictionRepo = predictionRepo;
            _accountRepo = accountRepo;
        }

        // GET: api/prediction/{user-id}/30/12/2015
        /// <summary>
        /// Get Prediction by day
        /// </summary>
        /// <param name="id">User Id</param>
        /// <param name="day">Filter by day</param>
        /// <returns>Predictions data</returns>
        [HttpGet]
        [Route("{id}/{day}")]
        public IEnumerable<PredictionInformation> Get(string id, int day)
        {
            return getPredictionsByDay(id, day);
        }

        // PUT: api/prediction/{user-id}
        /// <summary>
        /// Update user's prediction
        /// </summary>
        /// <param name="id">User id</param>
        /// <param name="value">Request body</param>
        [HttpPut]
        [Route("{id}")]
        public IEnumerable<PredictionInformation> Put(string id, PredictionRequest value)
        {
            var areArgumentsValid = !string.IsNullOrEmpty(id) && value != null && !string.IsNullOrEmpty(value.MatchId);
            if (!areArgumentsValid) return null;

            var selectedMatch = _matchesRepo.GetMatchById(value.MatchId);
            var isMatchReadyForPrediction = selectedMatch != null
                && !selectedMatch.StartedDate.HasValue
                && !selectedMatch.CompletedDate.HasValue
                && (selectedMatch.TeamAwayId.Equals(value.TeamId) || selectedMatch.TeamHomeId.Equals(value.TeamId) || string.IsNullOrEmpty(value.TeamId));
            if (!isMatchReadyForPrediction) return null;

            var selectedProfile = _accountRepo.GetUserProfileById(id);
            if (selectedProfile == null) return null;

            if (value.IsCancel) _predictionRepo.CancelUserPrediction(id, value.MatchId);
            else
            {
                var predictionPoints = string.IsNullOrEmpty(value.TeamId) ? selectedMatch.DrawPoints :
                    value.TeamId.Equals(selectedMatch.TeamHomeId) ? selectedMatch.TeamHomePoint : selectedMatch.TeamAwayPoint;
                var actualPredictionPoints = predictionPoints.HasValue ? predictionPoints.Value : 0;
                _predictionRepo.SetUserPrediction(id, value.MatchId, value.TeamId, actualPredictionPoints, DateTime.Now);
            }
            var now = DateTime.Now;
            return getPredictionsByDay(id, selectedMatch.BeginDate.Date.Day);
        }

        // Get Prediction by day
        private IEnumerable<PredictionInformation> getPredictionsByDay(string id, int day)
        {
            var fromDate = DateTime.Now.AddDays(-3);
            var toDate = DateTime.Now.AddDays(3);
            var dateRange = Enumerable.Range(0, toDate.Subtract(fromDate).Days + 1)
                                      .Select(d => fromDate.AddDays(d));
            var selectedDate = dateRange.FirstOrDefault(it => it.Date.Day == day);
            var matches = _matchesRepo.GetMatchesByDate(selectedDate).ToList();
            if (selectedDate == null) return null;

            var prediction = _predictionRepo.GetUserPredictions().ToList();

            var splitSeparetor = '-';
            var userIdPosition = 0;
            var matchIdPosition = 1;
            var selectedPredictions = from predict in prediction.Where(it => it.id.Split(splitSeparetor)[userIdPosition] == id && it.CreatedDate.Date == selectedDate.Date).ToList()
                                      let matchId = predict.id.Split(splitSeparetor)[matchIdPosition]
                                      let selectedMatch = matches.FirstOrDefault(it => it.id == matchId)
                                      let isPredictTeamHome = selectedMatch.TeamHomeId == predict.PredictionTeamId
                                      let isPredictTeamAway = selectedMatch.TeamAwayId == predict.PredictionTeamId
                                      let isPredictDraw = string.IsNullOrEmpty(predict.PredictionTeamId)
                                      select new PredictionInformation
                                      {
                                          MatchId = matchId,
                                          IsPredictionTeamHome = isPredictTeamHome,
                                          IsPredictionTeamAway = isPredictTeamAway,
                                          IsPredictionDraw = isPredictDraw,
                                          PredictionPoints = predict.PredictionPoints
                                      };
            return selectedPredictions;
        }
    }
}
