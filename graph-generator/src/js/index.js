var application = angular.module('myApp', []);

application.controller('myCtrl', myCtrl);
function myCtrl($scope, $http, $interval) {
	/*fetching the data*/
	$scope.fetchCryptoData = function(){
		var urlString = "https://api.coinmarketcap.com/v1/ticker/?limit=10";
		return $http({
			method: 'GET',
			url: urlString
		}).then(function success(response) {
				$scope.lastUpdate = new Date().toLocaleTimeString();
				return response.data;
			}, function error(response) {
				return "Failed to Fetch Data";
			}
		)
	};
	
	/*initialisation*/
	this.$onInit = function () {
		$scope.fetchCryptoData().then(function success(data){
			$scope.prepareData(data);
		});
		
		/*updating every 5 minutes*/
		$interval(function () {
			$scope.fetchCryptoData().then(function success(data){
				$scope.prepareData(data);
			});
		},300000);
	};
	
	/*preparing data*/
	$scope.prepareData = function(incomingdata){
		if(incomingdata != "Failed to Fetch Data"){
			$scope.labels = [];
			$scope.data = [];
			$scope.bordercolor = [];
			$scope.backgroundColor = [];
			$scope.red = 255;
			$scope.green = 255;
			$scope.blue = 255
			$scope.opacity = 0;
			angular.forEach(incomingdata, function (value, key) {
				$scope.labels.push(value.symbol);
				$scope.data.push(value.price_usd);
				if($scope.red>=70){
					$scope.red = $scope.red - 70;
				}else{
					$scope.red = 255;
					$scope.red = $scope.red - 70;
				}
				if($scope.green>=30){
					$scope.green = $scope.green - 30;
				}else{
					$scope.green = 255;
					$scope.green = $scope.green - 30;
				}
				if($scope.blue>=20){
					$scope.blue = $scope.blue - 20;
				}else{
					$scope.blue = 255;
					$scope.blue = $scope.blue - 20;
				}
				if((key%2)==0){
					$scope.opacity = 0.6;
				}else if((key%2)==1){
					$scope.opacity = 0.2;
				}
				$scope.backgroundColorTemp = 'rgba('+$scope.red+','+$scope.green+','+$scope.blue+','+$scope.opacity+')';
				$scope.backgroundColor.push($scope.backgroundColorTemp);
				$scope.bordercolor.push('rgba(0,0,0,0.4)');
			});
		}else{
			$scope.labels = ['No latest data found'];
			$scope.data = ['0'];
			$scope.backgroundColor = ['rgba(0,0,0,0.4)'];
			$scope.bordercolor = ['rgba(0,0,0,0.4)'];
		}
		
		$scope.generateChart($scope.labels,$scope.data,$scope.backgroundColor,$scope.bordercolor);
	};
	
	/*bar chart using chart.js*/
	$scope.generateChart =  function(fetchedlabels,fetcheddata,fetchedbackgroundColor,fetchedbordercolor){
		var ctx = document.getElementById("myChart");
		var myChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: fetchedlabels,
				datasets: [{
					label: 'In USD',
					data: fetcheddata,
					backgroundColor: fetchedbackgroundColor,
					borderColor: fetchedbordercolor,
					borderWidth: 1
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
			}
		});
	};
};
myCtrl.$inject = ['$scope','$http','$interval'];
