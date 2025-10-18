# Suggested Workflow & Best Practices

## Weekly Team Workflow

### Monday - Team Updates
**For each sub-team (VC and AM):**
1. Open the portfolio tracker
2. Click "Refresh" on relevant funds to update prices
3. Review performance since last week
4. Identify positions needing attention

**Your daughter as Head of Funds:**
- Review Portfolio Summary
- Note any significant changes
- Prepare agenda for Wednesday meeting

### Wednesday - Investment Committee
**Full Team Meeting:**
1. **Review Current Portfolio**
   - Export CSV before meeting
   - Share performance metrics
   - Discuss winners/losers

2. **New Investment Pitches**
   - Team members present research
   - Vote on new positions
   - Add approved positions to tracker

3. **Portfolio Rebalancing**
   - Check if any fund is over-allocated
   - Discuss trimming or adding positions
   - Update tracker in real-time during meeting

### Friday - Reporting
**Your daughter's leadership tasks:**
1. Export final CSV for the week
2. Calculate weekly returns
3. Update society members on performance
4. Document key decisions made

## Position Management Best Practices

### Adding Positions - Checklist

Before adding to tracker, ensure:
- [ ] Investment thesis documented (in Notion/Google Drive)
- [ ] Due diligence completed
- [ ] ESG criteria verified
- [ ] Position size follows fund guidelines
- [ ] Approved by investment committee

### Tracking Template

For each position, maintain (outside tracker):
- **Investment Thesis**: Why we bought it
- **ESG Rationale**: Sustainability impact
- **Entry Date**: When we added it
- **Target Price**: When to consider selling
- **Risk Factors**: What could go wrong
- **Review Notes**: Quarterly assessment

## Fund Management Guidelines

### Aggressive Fund (VC Focus)
- **Team**: 3 VC analysts
- **Risk Level**: High
- **Typical Holdings**: 8-12 positions
- **Position Sizing**: 5-15% per position
- **Focus**: Early-stage clean tech, renewable energy startups
- **Hold Period**: 2-5 years (simulated)

**Refresh Frequency**: Weekly (VC positions may not update daily)

### Balanced Fund (Mixed)
- **Team**: 2 AM + 1 VC analyst
- **Risk Level**: Medium
- **Typical Holdings**: 12-20 positions
- **Position Sizing**: 3-10% per position
- **Focus**: Growth-stage sustainable companies, established ESG leaders
- **Hold Period**: 1-3 years

**Refresh Frequency**: 2-3 times per week

### Conservative Fund (AM Focus)
- **Team**: 3-4 AM analysts
- **Risk Level**: Low
- **Typical Holdings**: 15-25 positions
- **Position Sizing**: 2-8% per position
- **Focus**: Large-cap ESG stocks, green bonds, sustainable ETFs
- **Hold Period**: 1-2 years

**Refresh Frequency**: Daily or every other day

## API Management Tips

### Staying Within Free Tier Limits
Alpha Vantage Free Tier: 5 calls/minute, 500/day

**Strategy:**
- Refresh one fund at a time
- Wait 15 seconds between fund refreshes
- Don't refresh more than 2-3 times per day per fund
- Coordinate refreshes before key meetings

**Weekly Allocation Example:**
- Monday: Full refresh (all 3 funds) = ~30 calls
- Wednesday: Refresh before meeting = ~30 calls  
- Friday: Final weekly refresh = ~30 calls
- Total: ~90 calls/week (well under 500/day limit)

### When to Get Paid API
Consider upgrading if:
- Team wants real-time updates
- Adding cryptocurrency tracking
- Need more than 25-30 positions total
- Wanting historical data analysis

## Data Management

### Daily
- Positions automatically saved in browser
- No action needed

### Weekly
- **Export CSV** on Friday
- Save to Google Drive: `/Investment Society/Portfolio Reports/Week-[DATE].csv`
- Add to weekly report

### Monthly
- Compare month-end vs month-start
- Calculate monthly returns by fund
- Review fund allocations vs targets
- Present to broader society membership

### Semester
- Full portfolio review
- Export all data
- Calculate semester returns
- Document lessons learned
- Create presentation for society

## Meeting Formats

### Quick Stand-up (15 min)
Your daughter + 2 senior analysts
1. Open tracker
2. Review overnight/weekly changes
3. Discuss urgent matters
4. Assign action items

### Investment Committee (45-60 min)
Full team of 8
1. **Portfolio Review** (15 min)
   - Open tracker on shared screen
   - Review each fund's performance
2. **New Pitches** (20 min)
   - 2-3 new investment proposals
   - Vote and add winners to tracker
3. **Portfolio Discussion** (10 min)
   - Rebalancing needs
   - Positions to exit
4. **Administrative** (5 min)
   - Upcoming events
   - Action items

### Guest Speaker Series (60-90 min)
With tracker as visual aid:
1. Show current portfolio to guest
2. Discuss investment approach
3. Get feedback on positions
4. Q&A with team

## Red Flags to Watch

Use the tracker to identify:
- ❌ Any position > 20% of fund (over-concentrated)
- ❌ Fund down > 15% month-over-month
- ❌ Individual position down > 30% from entry
- ❌ Cash position < 10% (over-invested)
- ❌ More than 3 consecutive red weeks

## Success Metrics

Beyond returns, track:

### Learning Metrics:
- How many pitches per member per semester?
- How many positions analyzed?
- Diversity of sectors covered?

### Operational Metrics:
- Meeting attendance
- Time from pitch to decision
- Portfolio turnover rate

### Impact Metrics:
- Total sustainable companies supported
- Estimated CO2 impact of holdings
- % of portfolio in high-ESG companies

## Tips for Your Daughter

### As Head of Funds:

1. **Lead by example**: Always have tracker updated before meetings
2. **Delegate ownership**: Assign each fund to a senior analyst
3. **Document everything**: Use the CSV exports religiously
4. **Foster learning**: Celebrate good analysis, even on losing positions
5. **Stay organized**: Keep investment theses separate from tracker
6. **Communicate clearly**: Use the tracker as a visual aid in presentations

### Empowering Your Team:

- Give sub-teams autonomy within guidelines
- Let them present their fund's performance
- Encourage healthy competition between funds
- Celebrate learning, not just returns
- Use losses as teaching moments

### Working with Society Leadership:

- Export monthly reports for society president
- Present portfolio at general meetings
- Use tracker to recruit new members (show it's professional)
- Transparently share successes and failures

## Integration with Other Tools

### Notion/Google Drive
- Store: Investment memos, due diligence, meeting notes
- Link to: Specific positions in tracker

### Slack/Discord
- Share: Weekly CSV exports
- Discuss: Position changes and ideas
- Quick wins: Tag wins from the tracker

### Calendar
- Schedule: Regular refresh times
- Set reminders: Monthly export tasks
- Block time: Investment committee meetings

### Pitch Deck Software
- Import: CSV data for presentations
- Showcase: Fund performance charts
- Highlight: Top performers

## Semester Planning

### Week 1-2: Setup
- Deploy tracker
- Add initial positions
- Train team on usage

### Week 3-8: Build
- Add 3-5 positions per fund
- Regular refresh cadence
- Weekly exports

### Week 9-12: Optimize
- Rebalance based on performance
- Refine investment thesis
- Prepare mid-semester report

### Week 13-16: Scale
- Continue adding positions
- Guest speaker series
- Prepare final presentation

## Advanced Features (Future)

Once comfortable with basics, consider:
- Adding dividend tracking
- Creating performance charts in Google Sheets from CSVs
- Building a "watch list" for potential investments
- Tracking ESG scores manually alongside positions
- Creating a lessons learned document linked to each position

---

Remember: The tracker is a tool. The real value is in the discussion, analysis, and learning it enables!
