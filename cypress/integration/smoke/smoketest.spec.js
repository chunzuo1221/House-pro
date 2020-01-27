import * as Utils from './../../common/Utils';

describe('Smoke Test', () => {
const address = '10 Coila Street Turramurra NSW, Australia';
  it('should login to the application', () => {
    Utils.openApp();
    // Utils.searchForAddress(address);
  });

  // it('should show the property details and the buttons', () => {
  //   Utils.openApp();
  //   Utils.searchForAddress(address);
  //   cy.get('img[class="property-image"]');
  //   cy.contains('Refresh Get External Data');
  //   cy.contains('Survey Manager');

  //   cy.get('.container').find('.row').contains('Lot Number: ');
  //   cy.get('.container').find('.row').contains('Land Size: ');
  //   cy.get('.container').find('.row').contains('Waste Service Type: ');
  //   cy.get('.container').find('.row').contains('State Electorate: ');
  //   cy.get('.container').find('.row').contains('Property Type: ');
  //   cy.get('.container').find('.row').contains('Zoning: ');
  //   cy.get('.container').find('.row').contains('Waste Collection Day: ');
  //   cy.get('.container').find('.row').contains('Federal Electorate: ');
  //   cy.get('.container').find('.row').contains('Ward: ');
  // });

  // it('should display the location analysis', () => {
  //   Utils.openApp();
  //   Utils.searchForAddress(address);
  //   cy.get('.analysis-item').contains('Edit Details').click();
  //   cy.contains('Recalculate Service Proximity Scores');
  //   cy.contains('Reset Proximity Scores');
  //   // This would be the container for the scores
  //   cy.get('.gages-container');
  //   cy.get('.sec-title').contains('City / Beach / Train Index');
  // });
});
