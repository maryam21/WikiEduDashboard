require 'rails_helper'
require "#{Rails.root}/lib/revision_feedback_service"

describe RevisionFeedbackService do
  describe '#feedback' do
    let(:subject) { described_class.new(revision).feedback }

    context 'when the revision has no feature data' do
      let(:revision) { create(:revision) }

      it 'returns an empty array' do
        expect(subject).to eq([])
      end
    end

    context 'when the revision has feature data' do
      let(:revision) { create(:revision, features: features) }
      let(:features) do
        { 'feature.enwiki.revision.cite_templates' => 6,
          'feature.wikitext.revision.ref_tags' => 0,
          'feature.wikitext.revision.content_chars' => 9001,
          'feature.wikitext.revision.headings_by_level(2)' => 0,
          'feature.wikitext.revision.headings_by_level(3)' => 0 }
      end

      it 'returns an array of relevant feedback' do
        expect(subject.length).to eq(2)
      end
    end
  end
end
