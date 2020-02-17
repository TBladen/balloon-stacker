function doesBackgroundColorMatch(elemA, elemB) {
  return getComputedStyle(elemA).backgroundColor === getComputedStyle(elemB).backgroundColor;
}

class BalloonStacker {
  constructor(rootId, grid, colorMap) {
    this.rootElement = document.getElementById(rootId);
    this.grid = grid;
    this.colorMap = colorMap;

    const computedStyles = window.getComputedStyle(document.body);
    this.ballRadius = computedStyles.getPropertyValue('--ball-width');
    this.ballDiameter = computedStyles.getPropertyValue('--ball-diameter');

    this.reset();
    this.populateGrid();
  }

  reset() {
    this.rootElement.innerHTML = '';
  }

  populateGrid() {
    this.grid.forEach(row => {
      const rowElement = document.createElement('div');
      rowElement.classList.add('row');

      row.forEach(tube => {
        const tubeContainer = document.createElement('div');
        tubeContainer.classList.add('tube-container');

        const tubeHeaderElement = document.createElement('div');
        tubeHeaderElement.classList.add('tube-header');
        tubeContainer.appendChild(tubeHeaderElement);

        const tubeElement = document.createElement('div');
        tubeElement.classList.add('tube');
        tubeContainer.appendChild(tubeElement);

        const tubeInnerElement = document.createElement('div');
        tubeInnerElement.classList.add('tube-inner');
        tubeElement.appendChild(tubeInnerElement);

        tube.forEach(ball => {
          const ballElement = document.createElement('div');

          ballElement.classList.add('ball', this.colorMap[ball]);
          tubeInnerElement.appendChild(ballElement);
        });

        tubeContainer.onclick = this.onTubeClick(tubeContainer);
        rowElement.appendChild(tubeContainer);
      });

      this.rootElement.appendChild(rowElement);
    });
  }

  onTubeClick(tubeContainer) {
    return e => {
      e.preventDefault();

      const header = tubeContainer.querySelector('.tube-header');
      const tube = tubeContainer.querySelector('.tube-inner');

      const selectedBall = this.getSelectedBall();

      if (selectedBall) {
        if (selectedBall.parentNode === header) {
          // Deselect
          this.deselectBall(selectedBall);
        } else {
          const targetTubeBalls = tube.querySelectorAll('.ball');

          if (targetTubeBalls.length === 0 ||(doesBackgroundColorMatch(selectedBall, targetTubeBalls[0]) && targetTubeBalls.length < 4)) {
            // move ball
            selectedBall.parentNode.removeChild(selectedBall);
            tube.insertAdjacentElement('afterbegin', selectedBall);
          } else {
            // Select new ball
            this.deselectBall(selectedBall);
            this.selectBallFromTube(tubeContainer);
          }
        }
      } else {
        this.selectBallFromTube(tubeContainer);
      }
    }
  }

  selectBallFromTube(tubeContainer) {
    const tubeBalls = tubeContainer.querySelectorAll('.tube .ball');

    if (tubeBalls.length > 0) {
      const header = tubeContainer.querySelector('.tube-header');
      const tube = tubeContainer.querySelector('.tube-inner');
      const newSelectedBall = tubeBalls[0];

      tube.removeChild(newSelectedBall);
      header.appendChild(newSelectedBall);
    }
  }

  deselectBall(selectedBall) {
    const header = selectedBall.parentNode;
    const tubeContainer = header.parentNode;

    if (selectedBall) {
      const tube = tubeContainer.querySelector('.tube-inner');

      header.removeChild(selectedBall);
      tube.insertAdjacentElement('afterbegin', selectedBall);
    }
  }

  getSelectedBall() {
    return this.rootElement.querySelector('.tube-header .ball');
  }
}

game = new BalloonStacker(
  'root',
  [
    [
      [1, 2, 3, 4],
      [2, 3, 4, 1],
      [1, 3, 3, 4],
      [2, 1, 4,],
      [2]
    ]
  ], {
    1: 'orange',
    2: 'blue',
    3: 'green',
    4: 'red',
  }
);
