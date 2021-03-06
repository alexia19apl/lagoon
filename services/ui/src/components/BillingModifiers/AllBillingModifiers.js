import * as R from 'ramda';
import React from 'react';
import css from 'styled-jsx/css';
import Button from '../Button';
import { Mutation, Query } from 'react-apollo';

import AllBillingModifiersQuery from 'lib/query/AllBillingModifiers';
import DeleteBillingModifierMutation from 'lib/mutation/DeleteBillingModifier';
import BillingGroupCostsQuery from 'lib/query/BillingGroupCosts';

import withQueryLoading from 'lib/withQueryLoading';
import withQueryError from 'lib/withQueryError';

import { bp, color, fontSize } from 'lib/variables';
import { json } from 'body-parser';


const AllBillingModifiers = ({group, modifiers, month}) => (

  <div className="modifiers">

    <h2>All Billing Modifiers</h2>
    <div className="header">
      <label className="weight">Weight</label>
      <label className="dates">Dates</label>
      <label className="value">Value</label>
    </div>

      <div className="data-table">
        {!modifiers.length && (
          <div className="data-none">No Billing Modifiers</div>
        )}
        {modifiers.map(({ id, group, name, startDate, endDate, customerComments, adminComments, weight, discountFixed, discountPercentage, extraFixed, extraPercentage }) => (
          <div className="data-row" key={id}>
            <div className="weight">{weight}</div>
            <div className="dates">{startDate.replace('00:00:00', '')} - {endDate.replace('00:00:00', '')}</div>
            <div className="value" >
              <div>
                {discountFixed !== 0 ? `- $${discountFixed}` : ''}
              </div>
              <div>
                {discountPercentage !== 0 ? `-  ${discountPercentage}%` : ''}
              </div>
              <div>
                {extraFixed !== 0 ? `+ $${extraFixed}` : ''}
              </div>
              <div>
                {extraPercentage !== 0 ? `+  ${extraPercentage}%` : ''}
              </div>
            </div>
            <div className="delete">
              <Mutation
                mutation={DeleteBillingModifierMutation}
                refetchQueries={[
                  { query: AllBillingModifiersQuery, variables: { input: { name: group.name } } },
                  { query: BillingGroupCostsQuery, variables: { input: { name: group.name }, month }}
                ]}
              >
                {(
                  deleteBillingModifier,
                  { loading, called, error, data }
                ) => {
                  if (error) {
                    return <div>{error.message}</div>;
                  }

                  if (called) {
                    return <div>Deleting Billing Modifier...</div>;
                  }

                  return (
                    <Button
                      action={() =>
                        deleteBillingModifier({
                          variables: { input: { id } }
                        })
                      }
                    >
                      Delete
                    </Button>
                  );
                }}
              </Mutation>
            </div>                
          </div>
          )
        )}
      </div>


    <style jsx>{`

      .modifiers {
        padding: 30px 20px;
        background-color: #fff;
        border: 1px solid #f5f6fa;
        border-radius: 3px;
        box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.03);
      }
      
      .header {
        @media ${bp.wideUp} {
          align-items: center;
          display: flex;
          margin: 0 0 14px;
          padding-right: 40px;
        }
        @media ${bp.smallOnly} {
          flex-wrap: wrap;
        }
        @media ${bp.tabletUp} {
          margin-top: 40px;
        }

        label {
          display: none;
          padding-left: 20px;
          @media ${bp.wideUp} {
            display: block;
          }

          &.dates {
            width: 35%;
            @media ${bp.extraWideUp} {
              width: 50%;
            }
          }

          &.value {
            width: 45%;
            @media ${bp.extraWideUp} {
              width: 45%;
            }
          }
        }
      }

      .data-table {
        background-color: ${color.white};
        border: 1px solid ${color.lightestGrey};
        border-radius: 3px;
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.03);

        .data-none {
          border: 1px solid ${color.white};
          border-bottom: 1px solid ${color.lightestGrey};
          border-radius: 3px;
          line-height: 1.5rem;
          padding: 8px 0 7px 0;
          text-align: center;
        }

        .data-row {
          border: 1px solid ${color.white};
          border-bottom: 1px solid ${color.lightestGrey};
          border-radius: 0;
          line-height: 1.5rem;
          padding: 8px 0 7px 0;
          @media ${bp.wideUp} {
            display: flex;
            justify-content: space-between;
            padding-right: 15px;
          }

          & > div {
            padding-left: 20px;
            @media ${bp.wideDown} {
              padding-right: 40px;
            }
            @media ${bp.wideUp} {
              &.dates {
                width: 50%;
              }
              &.value {
                width: 100px;
              }
            }
          }

          &:hover {
            border: 1px solid ${color.brightBlue};
          }

          &:first-child {
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
          }

          &:last-child {
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
          }
        }
      }
    `}</style>
  </div>
);

export default AllBillingModifiers;
